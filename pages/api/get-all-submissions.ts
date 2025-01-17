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

    const submissions = await prisma.submission.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        menFirst: true,
        menSecond: true,
        menThird: true,
        womenFirst: true,
        womenSecond: true,
        womenThird: true,
      },
      orderBy: {
        points: 'desc',
      },
    });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Error in get-all-submissions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
