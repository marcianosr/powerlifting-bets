import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const result = await prisma.competitionResult.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ result });
    } catch (error) {
        console.error('Error fetching competition results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
