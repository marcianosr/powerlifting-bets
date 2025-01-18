import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { SelectTop3Button } from "../components/SelectTop3Button";
import { liftersData } from "../data/liftersData";
import { isAdmin } from "../utils/auth";
import { CompetitionResult, LeaderboardEntry, LifterInfo } from "../types/leaderboard";
import { LoadingState } from "../components/leaderboard/LoadingState";
import { OfficialResults } from "../components/leaderboard/OfficialResults";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { PointsSystem } from "../components/leaderboard/PointsSystem";
import { SelectionColors } from "../components/leaderboard/SelectionColors";

const Leaderboards = () => {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<LeaderboardEntry[]>([]);
  const [results, setResults] = useState<CompetitionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch competition results
        const resultsResponse = await fetch("/api/get-competition-results");
        if (resultsResponse.ok) {
          const resultsData = await resultsResponse.json();
          setResults(resultsData);
        }

        // Fetch all submissions
        const submissionsResponse = await fetch("/api/get-all-submissions");
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          setSubmissions(submissionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLifterInfo = (name: string): LifterInfo => {
    const lifter = liftersData.find((l) => l.name === name);
    if (!lifter) return { name, displayName: name };

    return {
      name: lifter.name,
      displayName: `${lifter.name} (${lifter.wilks})`,
      wilks: lifter.wilks,
    };
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Powerlifting Predictions</h1>
        <div className="flex gap-2">
          {isAdmin(session) && (
            <Button
              label="Set Results"
              onClick={() => router.push("/admin/set-results")}
              className="p-button-secondary"
            />
          )}
          <SelectTop3Button />
        </div>
      </div>

      {results && <OfficialResults results={results} getLifterInfo={getLifterInfo} />}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <LeaderboardTable
          submissions={submissions}
          results={results}
          session={session}
          getLifterInfo={getLifterInfo}
        />

        <div className="mt-6 space-y-4">
          <PointsSystem />
          {results && <SelectionColors />}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboards;
