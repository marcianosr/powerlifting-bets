import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Lifter } from "../data/liftersData";

interface Submission {
    id: string;
    submitter: string;
    top3: string;
    createdAt: string;
}

const Submissions = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const response = await fetch("/api/get-submissions");
            const data = await response.json();
            setSubmissions(data);
        };

        fetchSubmissions();
    }, []);

    const picksTemplate = (rowData: Submission) => {
        const picks: Lifter[] = JSON.parse(rowData.top3);
        return picks.map((pick: Lifter) => (
            <div key={pick.name}>{pick.name}</div>
        ));
    };

    return (
        <div>
            <h1>Submissions</h1>
            <DataTable value={submissions} paginator rows={10}>
                <Column field="submitter" header="Submitter" />
                <Column field="top3" header="Picks" body={picksTemplate} />
                <Column
                    field="createdAt"
                    header="Submitted At"
                    body={(rowData: Submission) =>
                        new Date(rowData.createdAt).toLocaleString()
                    }
                />
            </DataTable>
        </div>
    );
};

export default Submissions;
