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
            orderBy: {
                submittedAt: 'desc'
            }
        });

        if (!submission) {
            return res.status(404).json({ error: 'No submission found' });
        }

        let parsedTop3;
        try {
            parsedTop3 = typeof submission.top3 === 'string' 
                ? JSON.parse(submission.top3)
                : submission.top3;
        } catch (error) {
            console.error('Error parsing top3:', error);
            parsedTop3 = [];
        }
        
        res.status(200).json({
            ...submission,
            top3: parsedTop3
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
