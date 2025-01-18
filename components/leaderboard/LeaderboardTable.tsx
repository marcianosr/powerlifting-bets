import { Session } from "next-auth";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CompetitionResult, LeaderboardEntry, LifterInfo } from "../../types/leaderboard";

type LeaderboardTableProps = {
  submissions: LeaderboardEntry[];
  results: CompetitionResult | null;
  session: Session | null;
  getLifterInfo: (name: string) => LifterInfo;
};

export const LeaderboardTable = ({ submissions, results, session, getLifterInfo }: LeaderboardTableProps) => {
  const renderPosition = (rowIndex: number) => {
    const position = rowIndex + 1;
    let medal = "";
    if (position === 1) medal = "🥇";
    else if (position === 2) medal = "🥈";
    else if (position === 3) medal = "🥉";

    return (
      <div className="flex items-center">
        <span className="font-bold mr-2">{position}</span>
        {medal && <span className="text-xl">{medal}</span>}
      </div>
    );
  };

  const renderSelections = (rowData: LeaderboardEntry, gender: "men" | "women") => {
    const selections = [
      rowData[`${gender}First`],
      rowData[`${gender}Second`],
      rowData[`${gender}Third`],
    ];

    const official = gender === "men"
      ? [results?.menFirst, results?.menSecond, results?.menThird]
      : [results?.womenFirst, results?.womenSecond, results?.womenThird];

    return (
      <div className="space-y-2">
        {selections.map((name, index) => {
          if (!name) return null;

          const lifterInfo = getLifterInfo(name);
          let className = "py-1 rounded px-2 flex items-center justify-between";

          if (results) {
            if (name === official[index]) {
              className += " bg-green-100 text-green-800"; // Exact match
            } else if (official?.includes(name)) {
              className += " bg-yellow-100 text-yellow-800"; // Right lifter, wrong position
            }
          }

          return (
            <div key={index} className={className}>
              <div>
                <span className="font-medium mr-2">{index + 1}.</span>
                <span>{lifterInfo.displayName}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DataTable
      value={submissions}
      sortField="points"
      sortOrder={-1}
      className="mb-4"
      rowClassName={(data) => ({
        "bg-yellow-50": data.email === session?.user?.email,
      })}
      responsiveLayout="stack"
    >
      <Column
        header="#"
        body={(_, options) => renderPosition(options.rowIndex)}
        className="w-16"
      />
      <Column field="name" header="Name" sortable className="font-medium" />
      <Column
        field="points"
        header="Points"
        sortable
        body={(rowData) => (
          <div className="flex items-center">
            <span className="font-bold text-lg">{rowData.points || 0}</span>
            <span className="text-sm text-gray-600 ml-1">/ 18</span>
          </div>
        )}
      />
      <Column
        header="Men's Selections"
        body={(rowData) => renderSelections(rowData, "men")}
        className="min-w-[300px]"
      />
      <Column
        header="Women's Selections"
        body={(rowData) => renderSelections(rowData, "women")}
        className="min-w-[300px]"
      />
    </DataTable>
  );
};
