import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SelectTop3Button } from "../components/SelectTop3Button";
import { Submission } from "@prisma/client";
import { useRouter } from "next/router";
import { liftersData } from "../data/liftersData";

interface Submission {
	name: string;
	email: string;
	points: number;
	top3: any[];
}

const Leaderboards = () => {
	const { data: session } = useSession();
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [competitionResults, setCompetitionResults] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const isAdmin = session?.user?.email?.startsWith("msrschildmeijer");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [submissionsRes, resultsRes] = await Promise.all([
					fetch("/api/get-submissions"),
					fetch("/api/get-competition-results"),
				]);

				const submissionsData = await submissionsRes.json();
				setSubmissions(submissionsData);

				if (resultsRes.ok) {
					const resultsData = await resultsRes.json();
					setCompetitionResults(resultsData.result);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const getTop3Data = (data: any) => {
		if (!data) return [];
		if (typeof data === "string") {
			try {
				return JSON.parse(data);
			} catch {
				return [];
			}
		}
		return data;
	};

	const pointsTemplate = (rowData: Submission) => {
		return <span className="font-bold">{rowData.points || 0}</span>;
	};

	const top3Template = (rowData: Submission) => {
		const top3 = getTop3Data(rowData.top3);
		const officialTop3 = competitionResults?.top3 ? getTop3Data(competitionResults.top3) : [];

		return (
			<div>
				{top3.map((lifter: any, index: number) => (
					<div
						key={index}
						className={
							officialTop3[index]?.name === lifter.name
								? "text-green-500 font-bold"
								: officialTop3.some((t: any) => t.name === lifter.name)
								? "text-yellow-500"
								: ""
						}
					>
						{index + 1}. {lifter.name}
					</div>
				))}
			</div>
		);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	const officialTop3 = competitionResults?.top3 ? getTop3Data(competitionResults.top3) : [];

	return (
		<div className="p-4">
			<div className="mb-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Leaderboard</h1>
				<div className="flex gap-2">
					{isAdmin && (
						<Button
							label="Admin Results"
							onClick={() => router.push("/admin/set-results")}
							className="p-button-secondary"
						/>
					)}
					<SelectTop3Button />
				</div>
			</div>

			{competitionResults && competitionResults.top3 && (
				<Card className="mb-8">
					<h2 className="text-2xl font-bold mb-4">🏆 Official Competition Results</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{officialTop3.map((lifter: any, index: number) => {
							const lifterData = liftersData.find(l => l.name === lifter.name);
							return (
								<div key={index} className="bg-gray-50 p-4 rounded-lg">
									<div className="text-xl font-bold mb-2">
										{index === 0 ? "🥇 First Place" : 
										 index === 1 ? "🥈 Second Place" : 
										 "🥉 Third Place"}
									</div>
									<div className="text-lg font-semibold">{lifter.name}</div>
									{lifterData && (
										<div className="text-sm text-gray-600 mt-2">
											<div>Total: {lifterData.total}kg</div>
											<div>Points: {lifterData.points}</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
					<div className="mt-4 text-sm text-gray-500">
						Last updated: {new Date(competitionResults.updatedAt).toLocaleString()}
					</div>
				</Card>
			)}

			<Card>
				<h2 className="text-xl font-bold mb-4">User Predictions</h2>
				<DataTable
					value={submissions}
					className="mb-4"
					sortField="points"
					sortOrder={-1}
				>
					<Column field="name" header="Name" sortable />
					<Column
						field="points"
						header="Points"
						body={pointsTemplate}
						sortable
					/>
					<Column header="Selections" body={top3Template} />
				</DataTable>

				<div className="mt-4 text-sm">
					<h3 className="font-bold mb-2">Points System:</h3>
					<ul className="list-disc pl-5">
						<li>Exact position match: 5 points</li>
						<li>Correct lifter, wrong position: 2 points</li>
					</ul>
				</div>
			</Card>
		</div>
	);
};

export default Leaderboards;
