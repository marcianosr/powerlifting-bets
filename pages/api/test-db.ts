import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log('Testing database connection...');
        console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
        
        // Test connection
        await prisma.$connect();
        
        // Test simple query
        const userCount = await prisma.user.count();
        const submissionCount = await prisma.submission.count();
        const resultCount = await prisma.competitionResult.count();
        
        res.status(200).json({
            status: 'Connected successfully',
            counts: {
                users: userCount,
                submissions: submissionCount,
                competitionResults: resultCount
            }
        });
    } catch (error) {
        console.error('Database connection test failed:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            prismaVersion: prisma._engineConfig?.version,
            nodeVersion: process.version,
        });
        res.status(500).json({ 
            error: 'Database connection failed',
            details: process.env.NODE_ENV === 'development' 
                ? error instanceof Error ? error.message : 'Unknown error'
                : undefined
        });
    } finally {
        await prisma.$disconnect();
    }
}
