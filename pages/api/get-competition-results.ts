import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
        console.log('Attempting to connect to database...');
        
        // Test database connection
        await prisma.$connect();
        console.log('Successfully connected to database');

        const result = await prisma.competitionResult.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        console.log('Query result:', result ? 'Found result' : 'No result found');
        res.status(200).json({ result });
    } catch (error) {
        console.error('Error in get-competition-results:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            nodeVersion: process.version,
            env: process.env.NODE_ENV
        });
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' 
                ? error instanceof Error ? error.message : 'Unknown error'
                : undefined
        });
    } finally {
        await prisma.$disconnect();
    }
}
