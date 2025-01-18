import { CompetitionResult, Gender, LifterInfo } from "../../types/leaderboard";

type PodiumDisplayProps = {
  gender: Gender;
  results: CompetitionResult;
  getLifterInfo: (name: string) => LifterInfo;
};

export const PodiumDisplay = ({ gender, results, getLifterInfo }: PodiumDisplayProps) => {
  const positions = gender === "men" 
    ? ["menFirst", "menSecond", "menThird"] 
    : ["womenFirst", "womenSecond", "womenThird"];
  const title = gender === "men" ? "Men's Podium" : "Women's Podium";

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ol className="space-y-3">
        {positions.map((pos, index) => {
          const lifterInfo = getLifterInfo(results[pos as keyof CompetitionResult] as string);
          return (
            <li key={pos} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{["🥇", "🥈", "🥉"][index]}</span>
                <div>
                  <div className="font-medium">{lifterInfo.name}</div>
                  <div className="text-sm text-gray-600">
                    Wilks: {lifterInfo.wilks} |{" "}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
