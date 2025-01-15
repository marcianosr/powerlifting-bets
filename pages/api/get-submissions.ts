import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { JsonObject, JsonArray } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const parseTop3 = (data: string | number | boolean | JsonObject | JsonArray | null) => {
	if (!data) return [];
	if (typeof data === "string") {
		try {
			return JSON.parse(data);
		} catch {
			return [];
		}
	}
	return data;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		res.setHeader("Allow", ["GET"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	try {
		const submissions = await prisma.submission.findMany({
			orderBy: {
				points: "desc",
			},
		});

		// Parse the top3 JSON for each submission
		const parsedSubmissions = submissions.map((sub) => ({
			...sub,
			top3: parseTop3(sub.top3),
		}));

		res.status(200).json(parsedSubmissions);
	} catch (error) {
		console.error("Error fetching submissions:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
