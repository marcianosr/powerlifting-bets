import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

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
				createdAt: "desc",
			},
		});

		res.status(200).json(submissions);
	} catch (error) {
		console.error("Error fetching submissions:", {
			error,
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});
		res.status(500).json({
			error: "Internal Server Error",
			details:
				process.env.NODE_ENV === "development"
					? error instanceof Error
						? error.message
						: "Unknown error"
					: undefined,
		});
	}
}
