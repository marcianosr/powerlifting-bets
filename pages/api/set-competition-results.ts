import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { isAdmin } from "../../utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !isAdmin(session)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { menFirst, menSecond, menThird, womenFirst, womenSecond, womenThird } = req.body;

    if (!menFirst || !menSecond || !menThird || !womenFirst || !womenSecond || !womenThird) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Deactivate all existing results
    await prisma.competitionResult.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new result
    const result = await prisma.competitionResult.create({
      data: {
        menFirst,
        menSecond,
        menThird,
        womenFirst,
        womenSecond,
        womenThird,
        isActive: true,
      },
    });

    // Calculate points for all submissions
    const submissions = await prisma.submission.findMany();
    
    for (const submission of submissions) {
      let points = 0;
      
      // Calculate points for men's selections
      if (submission.menFirst === menFirst) points += 3;
      if (submission.menFirst === menSecond) points += 2;
      if (submission.menFirst === menThird) points += 1;
      
      if (submission.menSecond === menFirst) points += 2;
      if (submission.menSecond === menSecond) points += 3;
      if (submission.menSecond === menThird) points += 2;
      
      if (submission.menThird === menFirst) points += 1;
      if (submission.menThird === menSecond) points += 2;
      if (submission.menThird === menThird) points += 3;

      // Calculate points for women's selections
      if (submission.womenFirst === womenFirst) points += 3;
      if (submission.womenFirst === womenSecond) points += 2;
      if (submission.womenFirst === womenThird) points += 1;
      
      if (submission.womenSecond === womenFirst) points += 2;
      if (submission.womenSecond === womenSecond) points += 3;
      if (submission.womenSecond === womenThird) points += 2;
      
      if (submission.womenThird === womenFirst) points += 1;
      if (submission.womenThird === womenSecond) points += 2;
      if (submission.womenThird === womenThird) points += 3;

      // Update submission points
      await prisma.submission.update({
        where: { id: submission.id },
        data: { points },
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in set-competition-results:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
