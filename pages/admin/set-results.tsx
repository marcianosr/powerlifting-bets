import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Lifter, liftersData } from "../../data/liftersData";
import { isAdmin } from '../../utils/auth';

const positions = [
	{ label: "First Place (1)", value: 1 },
	{ label: "Second Place (2)", value: 2 },
	{ label: "Third Place (3)", value: 3 },
];

export default function SetResults() {
	const { data: session, status } = useSession();
	const [lifters, setLifters] = useState(liftersData);
	const [loading, setLoading] = useState(true);
	const toast = useRef<Toast>(null);
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		if (!session) {
			router.push("/login");
			return;
		}

		if (!isAdmin(session)) {
			router.push("/");
			return;
		}

		// Load existing results
		const fetchExistingResults = async () => {
			try {
				const response = await fetch("/api/get-competition-results");
				if (response.ok) {
					const data = await response.json();
					if (data.result?.top3) {
						const existingTop3 = JSON.parse(data.result.top3);
						// Update lifters with existing positions
						const updatedLifters = liftersData.map((lifter) => {
							const existingPosition = existingTop3.find(
								(t: Lifter) => t.name === lifter.name
							)?.position;
							return {
								...lifter,
								position: existingPosition || null,
							};
						});
						setLifters(updatedLifters);
					}
				}
			} catch (error) {
				console.error("Error fetching existing results:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchExistingResults();
	}, [session, status, router]);

	if (status === "loading" || loading) {
		return <div>Loading...</div>;
	}

	if (!session || !isAdmin(session)) {
		return null;
	}

	const positionBodyTemplate = (rowData: Lifter) => {
		return (
			<Dropdown
				value={rowData.position}
				options={positions}
				onChange={(e) => {
					const updatedLifters = lifters.map((l) => {
						if (l.name === rowData.name) {
							return { ...l, position: e.value };
						}
						// Remove position from other lifter if this position is already assigned
						if (l.position === e.value) {
							return { ...l, position: null };
						}
						return l;
					});
					setLifters(updatedLifters);
				}}
				placeholder="Select Position"
			/>
		);
	};

	const saveResults = async () => {
		setLoading(true);
		try {
			const top3 = lifters
				.filter((l) => l.position)
				.sort((a, b) => (a.position || 0) - (b.position || 0))
				.map((l) => ({
					name: l.name,
					position: l.position,
				}));

			if (top3.length !== 3) {
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: "Please select exactly three lifters for the podium positions",
					life: 3000,
				});
				return;
			}

			const response = await fetch("/api/set-competition-results", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ top3 }),
				credentials: "include",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to save results");
			}

			const data = await response.json();
			toast.current?.show({
				severity: "success",
				summary: "Success",
				detail: data.message,
				life: 3000,
			});
			router.push("/leaderboards");
		} catch (error) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to save results. Please try again.",
				life: 3000,
			});
			console.error("Save error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-4">
			<Toast ref={toast} />
			<div className="mb-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Set Competition Results</h1>
				<Button
					label="Save Results"
					onClick={saveResults}
					loading={loading}
				/>
			</div>
			<DataTable
				value={lifters}
				className="mb-4"
				sortField="points"
				sortOrder={-1}
			>
				<Column field="name" header="Name" sortable />
				<Column field="points" header="Points" sortable />
				<Column field="total" header="Total" sortable />
				<Column
					field="position"
					header="Position"
					body={positionBodyTemplate}
					sortable
				/>
			</DataTable>
		</div>
	);
}
