import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { useRouter } from "next/router";
import { Lifter, liftersData } from "../data/liftersData";

const SelectTop3 = () => {
	const { data: session } = useSession();
	const [selectedLifters, setSelectedLifters] = useState<Lifter[]>([]);
	const [existingSelections, setExistingSelections] = useState(null);
	const [loading, setLoading] = useState(true);
	const toast = useRef<Toast>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchExistingSelections = async () => {
			if (session?.user?.email) {
				try {
					const response = await fetch(
						`/api/get-user-submission?email=${encodeURIComponent(
							session.user.email
						)}`
					);
					if (response.ok) {
						const data = await response.json();
						setExistingSelections(data);
						if (data?.top3) {
							const top3 = Array.isArray(data.top3)
								? data.top3
								: JSON.parse(data.top3);
							const selectedLifterObjects = top3
								.map((lifter: Lifter) =>
									liftersData.find(
										(l) => l.name === lifter.name
									)
								)
								.filter(Boolean);
							setSelectedLifters(selectedLifterObjects);
						}
					}
				} catch (error) {
					console.error("Error fetching selections:", error);
					toast.current?.show({
						severity: "error",
						summary: "Error",
						detail: "Failed to fetch existing selections",
						life: 3000,
					});
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchExistingSelections();
	}, [session]);

	const handleSelection = (e: { value: Lifter[] }) => {
		if (e.value.length <= 3) {
			setSelectedLifters(e.value);
		}
	};

	const handleSubmit = async () => {
		if (selectedLifters.length !== 3) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Please select exactly 3 lifters",
				life: 3000,
			});
			return;
		}

		try {
			const response = await fetch("/api/submit-top3", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					submitter: {
						email: session?.user?.email,
						name: session?.user?.name,
					},
					top3: selectedLifters.map((lifter) => ({
						name: lifter.name,
						squat: lifter.squat,
						bench: lifter.bench,
						deadlift: lifter.deadlift,
						total: lifter.total,
						points: lifter.points,
					})),
				}),
			});

			if (response.ok) {
				toast.current?.show({
					severity: "success",
					summary: "Success",
					detail: "Your selections have been saved",
					life: 3000,
				});
				router.push("/leaderboards");
			} else {
				throw new Error("Failed to submit");
			}
		} catch (error) {
			console.error("Error submitting:", error);
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Failed to submit selections",
				life: 3000,
			});
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!session) {
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">
					Please log in to make selections
				</h1>
			</div>
		);
	}

	return (
		<div className="p-4">
			<Toast ref={toast} />
			<div className="mb-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Select Your Top 3</h1>
				<Button
					label="Submit Selections"
					onClick={handleSubmit}
					disabled={selectedLifters.length !== 3}
				/>
			</div>

			{existingSelections && (
				<Message
					severity="info"
					text="You have already made selections. Submitting new ones will override your previous picks."
					className="mb-4"
				/>
			)}

			<div className="mb-4">
				<h2 className="text-xl mb-2">
					Selected Lifters ({selectedLifters.length}/3):
				</h2>
				{selectedLifters.map((lifter, index) => (
					<div key={lifter.name} className="mb-1">
						{index + 1}. {lifter.name}
					</div>
				))}
			</div>

			<DataTable
				value={liftersData}
				selection={selectedLifters}
				onSelectionChange={handleSelection}
				dataKey="name"
				className="mb-4"
				sortField="points"
				sortOrder={-1}
			>
				<Column
					selectionMode="multiple"
					headerStyle={{ width: "3rem" }}
				/>
				<Column field="name" header="Name" sortable />
				<Column field="points" header="Points" sortable />
				<Column field="total" header="Total" sortable />
				<Column field="squat" header="Squat" sortable />
				<Column field="bench" header="Bench" sortable />
				<Column field="deadlift" header="Deadlift" sortable />
			</DataTable>
		</div>
	);
};

export default SelectTop3;
