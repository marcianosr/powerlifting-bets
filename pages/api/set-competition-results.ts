import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	try {
		const session = await getServerSession(req, res, authOptions);

		if (!session?.user?.email) {
			console.log("No session or email");
			return res.status(401).json({ error: "Not authenticated" });
		}

		if (!session.user.email.startsWith("msrschildmeijer")) {
			console.log("Not admin email:", session.user.email);
			return res
				.status(403)
				.json({ error: "Unauthorized - Admin access required" });
		}

		const { top3 } = req.body;

		// Validate top3 data
		if (!Array.isArray(top3) || top3.length !== 3) {
			return res.status(400).json({ error: "Invalid top3 data" });
		}

		// Find existing active result
		const existingResult = await prisma.competitionResult.findFirst({
			where: { isActive: true },
		});

		let result;
		if (existingResult) {
			// Update existing result
			result = await prisma.competitionResult.update({
				where: { id: existingResult.id },
				data: {
					top3: JSON.stringify(top3),
				},
			});
		} else {
			// Create new result
			result = await prisma.competitionResult.create({
				data: {
					top3: JSON.stringify(top3),
					isActive: true,
				},
			});
		}

		// Calculate points for all submissions
		const submissions = await prisma.submission.findMany();

		for (const submission of submissions) {
			const userTop3 =
				typeof submission.top3 === "string"
					? JSON.parse(submission.top3)
					: submission.top3;

			let points = 0;

			// Compare each position
			for (let i = 0; i < 3; i++) {
				if (userTop3[i]?.name === top3[i]?.name) {
					// Exact position match
					points += 5;
				} else if (top3.some((t) => t.name === userTop3[i]?.name)) {
					// Right lifter, wrong position
					points += 2;
				}
			}

			// Update submission with points
			await prisma.submission.update({
				where: { id: submission.id },
				data: { points },
			});
		}

		res.status(200).json({
			message: existingResult ? "Results updated" : "Results created",
			result,
		});
	} catch (error) {
		console.error("Error in set-competition-results:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
