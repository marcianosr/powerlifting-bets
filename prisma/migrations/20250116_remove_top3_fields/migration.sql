-- Drop the top3 columns
ALTER TABLE "Submission" DROP COLUMN IF EXISTS "top3";
ALTER TABLE "CompetitionResult" DROP COLUMN IF EXISTS "top3";
