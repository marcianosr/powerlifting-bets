import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { SelectTop3Button } from "../components/SelectTop3Button";
import { liftersData } from "../data/liftersData";
import { isAdmin } from "../utils/auth";

interface LeaderboardEntry {
  name: string;
  email: string;
  points: number;
  menFirst?: string;
  menSecond?: string;
  menThird?: string;
  womenFirst?: string;
  womenSecond?: string;
  womenThird?: string;
}

interface CompetitionResult {
  menFirst: string;
  menSecond: string;
  menThird: string;
  womenFirst: string;
  womenSecond: string;
  womenThird: string;
  createdAt: string;
}

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading leaderboards...</div>
      </div>
    );
  }

  const getLifterInfo = (name: string) => {
    const lifter = liftersData.find((l) => l.name === name);
    if (!lifter) return { name, displayName: name };
    
    return {
      name: lifter.name,
      displayName: `${lifter.name} (${lifter.wilks})`,
      wilks: lifter.wilks,
      weight: lifter.weight,
      weightClass: lifter.weightClass,
    };
  };

  const renderPosition = (rowIndex: number) => {
    const position = rowIndex + 1;
    let medal = '';
    if (position === 1) medal = '🥇';
    else if (position === 2) medal = '🥈';
    else if (position === 3) medal = '🥉';

    return (
      <div className="flex items-center">
        <span className="font-bold mr-2">{position}</span>
        {medal && <span className="text-xl">{medal}</span>}
      </div>
    );
  };

  const renderSelections = (rowData: LeaderboardEntry, gender: 'men' | 'women') => {
    const selections = [
      rowData[`${gender}First`],
      rowData[`${gender}Second`],
      rowData[`${gender}Third`],
    ];
    
    const official = gender === 'men' 
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
              {lifterInfo.weightClass && (
                <span className="text-sm text-gray-600">
                  {lifterInfo.weightClass}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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

      {results && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Official Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Men's Podium</h3>
              <ol className="space-y-3">
                {['menFirst', 'menSecond', 'menThird'].map((pos, index) => {
                  const lifterInfo = getLifterInfo(results[pos as keyof CompetitionResult] as string);
                  return (
                    <li key={pos} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{['🥇', '🥈', '🥉'][index]}</span>
                        <div>
                          <div className="font-medium">{lifterInfo.name}</div>
                          <div className="text-sm text-gray-600">
                            Wilks: {lifterInfo.wilks} | {lifterInfo.weightClass}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Women's Podium</h3>
              <ol className="space-y-3">
                {['womenFirst', 'womenSecond', 'womenThird'].map((pos, index) => {
                  const lifterInfo = getLifterInfo(results[pos as keyof CompetitionResult] as string);
                  return (
                    <li key={pos} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{['🥇', '🥈', '🥉'][index]}</span>
                        <div>
                          <div className="font-medium">{lifterInfo.name}</div>
                          <div className="text-sm text-gray-600">
                            Wilks: {lifterInfo.wilks} | {lifterInfo.weightClass}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(results.createdAt).toLocaleString()}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <DataTable
          value={submissions}
          sortField="points"
          sortOrder={-1}
          className="mb-4"
          rowClassName={(data) => ({
            'bg-yellow-50': data.email === session?.user?.email
          })}
          responsiveLayout="stack"
        >
          <Column
            header="#"
            body={(_, options) => renderPosition(options.rowIndex)}
            className="w-16"
          />
          <Column 
            field="name" 
            header="Name" 
            sortable
            className="font-medium"
          />
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
            body={(rowData) => renderSelections(rowData, 'men')}
            className="min-w-[300px]"
          />
          <Column
            header="Women's Selections"
            body={(rowData) => renderSelections(rowData, 'women')}
            className="min-w-[300px]"
          />
        </DataTable>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-bold mb-2">Points System</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Per Selection</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Exact position match: 3 points</li>
                  <li>One position off: 2 points</li>
                  <li>Two positions off: 1 point</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Maximum Points</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Men's selections: 9 points</li>
                  <li>Women's selections: 9 points</li>
                  <li>Total possible: 18 points</li>
                </ul>
              </div>
            </div>
          </div>

          {results && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Selection Colors</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-green-100 rounded mr-2"></span>
                  <span>Exact position match (3 points)</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-yellow-100 rounded mr-2"></span>
                  <span>Right lifter, wrong position (1-2 points)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboards;
