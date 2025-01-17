import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import { Lifter, liftersData } from "../../data/liftersData";
import { isAdmin } from "../../utils/auth";

const SetResults = () => {
	const { data: session } = useSession();
	const [selectedMaleLifters, setSelectedMaleLifters] = useState<Lifter[]>(
		[]
	);
	const [selectedFemaleLifters, setSelectedFemaleLifters] = useState<
		Lifter[]
	>([]);
	const [existingResults, setExistingResults] = useState(null);
	const [loading, setLoading] = useState(true);
	const toast = useRef<Toast>(null);
	const router = useRouter();

	const maleLifters = liftersData.filter(
		(lifter) => lifter.gender === "male"
	);
	const femaleLifters = liftersData.filter(
		(lifter) => lifter.gender === "female"
	);

	useEffect(() => {
		const fetchExistingResults = async () => {
			try {
				const response = await fetch("/api/get-competition-results");
				if (response.ok) {
					const data = await response.json();
					setExistingResults(data);

					// Set male selections
					if (data?.menFirst && data?.menSecond && data?.menThird) {
						const selectedMales = [
							data.menFirst,
							data.menSecond,
							data.menThird,
						]
							.map((name) =>
								maleLifters.find((l) => l.name === name)
							)
							.filter(Boolean) as Lifter[];
						setSelectedMaleLifters(selectedMales);
					}

					// Set female selections
					if (
						data?.womenFirst &&
						data?.womenSecond &&
						data?.womenThird
					) {
						const selectedFemales = [
							data.womenFirst,
							data.womenSecond,
							data.womenThird,
						]
							.map((name) =>
								femaleLifters.find((l) => l.name === name)
							)
							.filter(Boolean) as Lifter[];
						setSelectedFemaleLifters(selectedFemales);
					}
				}
			} catch (error) {
				console.error("Error fetching results:", error);
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "Failed to fetch existing results",
					life: 3000,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchExistingResults();
	}, [session]);

	const handleMaleSelection = (e: { value: Lifter[] }) => {
		if (e.value.length <= 3) {
			setSelectedMaleLifters(e.value);
		}
	};

	const handleFemaleSelection = (e: { value: Lifter[] }) => {
		if (e.value.length <= 3) {
			setSelectedFemaleLifters(e.value);
		}
	};

	const handleSubmit = async () => {
		if (
			selectedMaleLifters.length !== 3 ||
			selectedFemaleLifters.length !== 3
		) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Please select exactly 3 male and 3 female lifters",
				life: 3000,
			});
			return;
		}

		try {
			const response = await fetch("/api/set-competition-results", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					menFirst: selectedMaleLifters[0].name,
					menSecond: selectedMaleLifters[1].name,
					menThird: selectedMaleLifters[2].name,
					womenFirst: selectedFemaleLifters[0].name,
					womenSecond: selectedFemaleLifters[1].name,
					womenThird: selectedFemaleLifters[2].name,
				}),
			});

			if (response.ok) {
				toast.current?.show({
					severity: "success",
					summary: "Success",
					detail: "Results have been set!",
					life: 3000,
				});
				router.push("/leaderboards");
			} else {
				throw new Error("Failed to set results");
			}
		} catch (error) {
			console.error("Error setting results:", error);
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to set results",
				life: 3000,
			});
		}
	};

	if (!session || !isAdmin(session)) {
		router.push("/");
		return null;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	const tableColumns = [
		{ field: "name", header: "Name" },
		{ field: "country", header: "Country" },
		{ field: "squat", header: "Squat" },
		{ field: "bench", header: "Bench" },
		{ field: "deadlift", header: "Deadlift" },
		{ field: "total", header: "Total" },
		{ field: "wilks", header: "Wilks" },
	];

	return (
		<div className="p-4">
			<Toast ref={toast} />
			<h1 className="text-2xl font-bold mb-4">Set Competition Results</h1>
			{existingResults && (
				<div className="mb-4 p-4 bg-yellow-100 rounded">
					<p className="text-yellow-800">
						Warning: Setting new results will update all user points
						based on the new results.
					</p>
				</div>
			)}

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Male Lifters</h2>
				<DataTable
					value={maleLifters}
					selection={selectedMaleLifters}
					onSelectionChange={() => {
						handleMaleSelection({ value: selectedMaleLifters });
					}}
					dataKey="name"
					className="mb-4"
					selectionMode="multiple"
					scrollable
					scrollHeight="400px"
					sortField="wilks"
					sortOrder={-1}
				>
					{tableColumns.map((col) => (
						<Column
							key={col.field}
							field={col.field}
							header={col.header}
							sortable
						/>
					))}
				</DataTable>
				<div className="text-sm mb-4 p-4 bg-gray-50 rounded">
					<div className="font-semibold mb-2">
						Selected Male Lifters (in order):{" "}
						{selectedMaleLifters.length}/3
					</div>
					{selectedMaleLifters.map((lifter, index) => (
						<div key={lifter.name} className="ml-4">
							{index + 1}. {lifter.name} - Wilks: {lifter.wilks}
						</div>
					))}
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">Female Lifters</h2>
				<DataTable
					value={femaleLifters}
					selection={selectedFemaleLifters}
					onSelectionChange={() => {
						handleFemaleSelection({ value: selectedFemaleLifters });
					}}
					dataKey="name"
					className="mb-4"
					selectionMode="multiple"
					scrollable
					scrollHeight="400px"
					sortField="wilks"
					sortOrder={-1}
				>
					{tableColumns.map((col) => (
						<Column
							key={col.field}
							field={col.field}
							header={col.header}
							sortable
						/>
					))}
				</DataTable>
				<div className="text-sm mb-4 p-4 bg-gray-50 rounded">
					<div className="font-semibold mb-2">
						Selected Female Lifters (in order):{" "}
						{selectedFemaleLifters.length}/3
					</div>
					{selectedFemaleLifters.map((lifter, index) => (
						<div key={lifter.name} className="ml-4">
							{index + 1}. {lifter.name} - Wilks: {lifter.wilks}
						</div>
					))}
				</div>
			</div>

			<Button
				label="Set Results"
				onClick={handleSubmit}
				disabled={
					selectedMaleLifters.length !== 3 ||
					selectedFemaleLifters.length !== 3
				}
				className="w-full"
			/>
		</div>
	);
};

export default SetResults;
