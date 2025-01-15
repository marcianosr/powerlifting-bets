import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { submitter, top3 } = req.body;

        // Check if user already has a submission
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                email: submitter.email
            }
        });

        let submission;
        if (existingSubmission) {
            // Update existing submission
            submission = await prisma.submission.update({
                where: {
                    id: existingSubmission.id
                },
                data: {
                    name: submitter.name || existingSubmission.name,
                    top3: JSON.stringify(top3),
                    submittedAt: new Date()
                }
            });
        } else {
            // Create new submission
            submission = await prisma.submission.create({
                data: {
                    name: submitter.name || 'Anonymous',
                    email: submitter.email,
                    userId: submitter.id,
                    top3: JSON.stringify(top3),
                    submittedAt: new Date()
                }
            });
        }

        res.status(200).json({ message: existingSubmission ? 'Updated successfully' : 'Submitted successfully', submission });
    } catch (error) {
        console.error('Error during submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
