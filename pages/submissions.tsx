import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Submissions = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const response = await fetch('/api/get-submissions');
            const data = await response.json();
            setSubmissions(data);
        };

        fetchSubmissions();
    }, []);

    const picksTemplate = (rowData: any) => {
        const picks = JSON.parse(rowData.top3);
        return picks.map((pick: any, index: number) => <div key={index}>{pick.name}</div>);
    };

    return (
        <div>
            <h1>Submissions</h1>
            <DataTable value={submissions} paginator rows={10}>
                <Column field="submitter" header="Submitter" />
                <Column field="top3" header="Picks" body={picksTemplate} />
                <Column field="createdAt" header="Submitted At" body={(rowData) => new Date(rowData.createdAt).toLocaleString()} />
            </DataTable>
        </div>
    );
};

export default Submissions;
