-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "points" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "CompetitionResult" (
    "id" TEXT NOT NULL,
    "top3" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CompetitionResult_pkey" PRIMARY KEY ("id")
);
