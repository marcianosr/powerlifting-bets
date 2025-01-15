import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const submission = await prisma.submission.findFirst({
            where: {
                email: email as string,
            },
        });

        res.status(200).json({ hasSubmitted: !!submission });
    } catch (error) {
        console.error('Error checking submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
