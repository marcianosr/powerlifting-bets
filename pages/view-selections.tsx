import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import { Lifter } from "../data/liftersData";

export type Submission = {
	createdAt: string | number | Date;
	id: number;
	name: string;
	email: string;
	userId: string;
	top3: Lifter[];
	submittedAt: string;
};

const ViewSelections = () => {
	const { data: session } = useSession();
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const toast = useRef<Toast>(null);

	useEffect(() => {
		const fetchSubmission = async () => {
			if (session?.user?.email) {
				try {
					const response = await fetch(
						`/api/get-user-submission?email=${encodeURIComponent(
							session.user.email
						)}`
					);
					if (response.ok) {
						const data = await response.json();
						setSubmission(data);
					}
				} catch (error) {
					console.error("Error fetching submission:", error);
					toast.current?.show({
						severity: "error",
						summary: "Error",
						detail: "Failed to load your selections",
						life: 3000,
					});
				}
				setLoading(false);
			}
		};

		fetchSubmission();
	}, [session]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!submission) {
		return <div>No submission found</div>;
	}

	return (
		<div className="p-4">
			<Toast ref={toast} />
			<div className="flex justify-between items-center mb-4">
				<h1>Your Top 3 Selections</h1>
				<Button
					label="Edit Selections"
					onClick={() => router.push("/select-top3")}
					className="p-button-primary"
				/>
			</div>

			<div className="card">
				<h2>
					Selected on:{" "}
					{new Date(submission.submittedAt).toLocaleString()}
				</h2>
				<DataTable value={submission.top3} className="mt-4">
					<Column field="name" header="Name" />
					<Column field="squat" header="Squat" />
					<Column field="bench" header="Bench" />
					<Column field="deadlift" header="Deadlift" />
					<Column field="total" header="Total" />
				</DataTable>
			</div>
		</div>
	);
};

export default ViewSelections;
