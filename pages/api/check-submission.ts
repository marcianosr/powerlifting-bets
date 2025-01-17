import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

interface CheckSubmissionResponse {
    hasSubmission: boolean;
    message?: string;
    submission?: {
        menFirst?: string | null;
        menSecond?: string | null;
        menThird?: string | null;
        womenFirst?: string | null;
        womenSecond?: string | null;
        womenThird?: string | null;
        points: number;
    };
}

interface ErrorResponse {
    message: string;
    code?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CheckSubmissionResponse | ErrorResponse>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method not allowed',
            code: 'METHOD_NOT_ALLOWED'
        });
    }

    try {
        // Check authentication
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            return res.status(401).json({
                message: 'Not authenticated',
                code: 'UNAUTHORIZED'
            });
        }

        const email = session.user?.email;
        if (!email) {
            return res.status(400).json({
                message: 'Email not found in session',
                code: 'INVALID_SESSION'
            });
        }

        // Find user's submission
        const submission = await prisma.submission.findUnique({
            where: { email },
            select: {
                menFirst: true,
                menSecond: true,
                menThird: true,
                womenFirst: true,
                womenSecond: true,
                womenThird: true,
                points: true
            }
        });

        // Return submission status and data if found
        return res.status(200).json({
            hasSubmission: !!submission,
            submission: submission || undefined
        });

    } catch (error) {
        // Log error with structured data
        console.error('Error checking submission:', {
            error,
            email: session?.user?.email,
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });

        // Return appropriate error response
        return res.status(500).json({
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
        });
    } finally {
        // Always disconnect from Prisma
        await prisma.$disconnect();
    }
}
