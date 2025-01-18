import { Card } from "primereact/card";
import { CompetitionResult, LifterInfo } from "../../types/leaderboard";
import { PodiumDisplay } from "./PodiumDisplay";

type OfficialResultsProps = {
  results: CompetitionResult;
  getLifterInfo: (name: string) => LifterInfo;
};

export const OfficialResults = ({ results, getLifterInfo }: OfficialResultsProps) => {
  return (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Official Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PodiumDisplay gender="men" results={results} getLifterInfo={getLifterInfo} />
        <PodiumDisplay gender="women" results={results} getLifterInfo={getLifterInfo} />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(results.createdAt).toLocaleString()}
      </div>
    </Card>
  );
};
