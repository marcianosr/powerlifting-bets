import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email } = req.query;

    if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const submission = await prisma.submission.findFirst({
            where: {
                email: email,
            },
            orderBy: {
                submittedAt: "desc",
            },
        });

        res.status(200).json({ hasSubmission: !!submission });
    } catch (error) {
        console.error('Error checking submission:', {
            error,
            email,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' 
                ? error instanceof Error ? error.message : 'Unknown error'
                : undefined
        });
    }
}
