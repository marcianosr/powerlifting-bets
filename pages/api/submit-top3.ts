import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

interface SubmissionRequest {
  menFirst: string;
  menSecond: string;
  menThird: string;
  womenFirst: string;
  womenSecond: string;
  womenThird: string;
}

interface SubmissionResponse {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  points: number;
  userId: string | null;
  menFirst: string | null;
  menSecond: string | null;
  menThird: string | null;
  womenFirst: string | null;
  womenSecond: string | null;
  womenThird: string | null;
}

interface ErrorResponse {
  message: string;
  code?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmissionResponse | ErrorResponse>
) {
  let session;

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({
        message: "Not authenticated",
        code: "UNAUTHORIZED",
      });
    }

    const body = req.body as SubmissionRequest;
    if (!body || !validateSubmission(body)) {
      return res.status(400).json({
        message: "Invalid submission data",
        code: "INVALID_SUBMISSION",
      });
    }

    // Check for existing submission
    const existingSubmission = await prisma.submission.findUnique({
      where: { email: session.user.email },
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "You have already submitted your picks",
        code: "DUPLICATE_SUBMISSION",
      });
    }

    // Create new submission
    const submission = await prisma.submission.create({
      data: {
        email: session.user.email,
        name: session.user.name || "Anonymous",
        menFirst: body.menFirst,
        menSecond: body.menSecond,
        menThird: body.menThird,
        womenFirst: body.womenFirst,
        womenSecond: body.womenSecond,
        womenThird: body.womenThird,
        points: 0, // Initial points
      },
    });

    return res.status(200).json(submission);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Log error with structured data
    console.error("Error in submit-top3:", {
      type: error instanceof Error ? error.constructor.name : typeof error,
      message: errorMessage,
      email: session?.user?.email,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    });
  } finally {
    await prisma.$disconnect();
  }
}

function validateSubmission(data: SubmissionRequest): boolean {
  const requiredFields = [
    "menFirst",
    "menSecond",
    "menThird",
    "womenFirst",
    "womenSecond",
    "womenThird",
  ] as const;

  // Check if all required fields are present and are strings
  return requiredFields.every(
    (field) => typeof data[field] === "string" && data[field].length > 0
  );
}
