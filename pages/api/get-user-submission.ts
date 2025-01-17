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

    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const submission = await prisma.submission.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        menFirst: true,
        menSecond: true,
        menThird: true,
        womenFirst: true,
        womenSecond: true,
        womenThird: true,
        points: true,
        createdAt: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }

    return res.status(200).json(submission);
  } catch (error) {
    console.error("Error in get-user-submission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
