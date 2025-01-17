import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const session = await getServerSession(req, res, authOptions);

		if (!session) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		const results = await prisma.competitionResult.findFirst({
			where: {
				isActive: true,
			},
			select: {
				id: true,
				menFirst: true,
				menSecond: true,
				menThird: true,
				womenFirst: true,
				womenSecond: true,
				womenThird: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		if (!results) {
			return res.status(404).json({ message: "No results found" });
		}

		return res.status(200).json(results);
	} catch (error) {
		console.error("Error in get-competition-results:", error);
		return res.status(500).json({ message: "Internal server error" });
	} finally {
		await prisma.$disconnect();
	}
}
