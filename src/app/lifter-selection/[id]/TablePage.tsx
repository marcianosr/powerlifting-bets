"use client";
import classNames from "classnames";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useSelectedLifter } from "../LifterSelectionProvider";

// TODO
type TablePageProps = {
	data: any;
	params: any;
};

const TablePage = ({ data, params }: TablePageProps) => {
	const { selectedLifters, addSelectedLifter } = useSelectedLifter();

	const isDisabled =
		selectedLifters.filter((lifter) => lifter.weightClass === params.id)
			.length >= 3;

	const tableClassNames = classNames("mt-8", {
		["pointer-events-none opacity-50"]: isDisabled,
	});

	return (
		<DataTable
			size="small"
			className={tableClassNames}
			value={data}
			selection={selectedLifters}
			onSelectionChange={(e) => addSelectedLifter(e.value)}
		>
			<Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
			<Column field="name" header="Naam" />
			<Column field="weightClass" header="Klasse" />
			<Column field="squat" header="Squat" />
			<Column field="bench" header="Bench" />
			<Column field="deadlift" header="Deadlift" />
			<Column field="total" header="Totaal" />
		</DataTable>
	);
};

export default TablePage;
