"use client";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { useSelectedLifter } from "../LifterSelectionProvider";

import React from "react";
import { SelectButton } from "primereact/selectbutton";

type InputControlsProps = {
	label: string;
	defaultValue: number;
};

const InputControls = ({ label, defaultValue }: InputControlsProps) => (
	<div className="flex flex-col flex-auto">
		<label htmlFor="horizontal-buttons" className="font-bold">
			{label}
		</label>

		<InputNumber
			value={defaultValue}
			onValueChange={(e: InputNumberValueChangeEvent) =>
				console.log(e.value)
			}
			showButtons
			buttonLayout="horizontal"
			className="w-1/4"
			step={2.5}
			decrementButtonClassName="p-button-danger"
			incrementButtonClassName="p-button-success"
			incrementButtonIcon="pi pi-plus"
			decrementButtonIcon="pi pi-minus"
			mode="decimal"
		/>
	</div>
);

const LiftersList = () => {
	const { selectedLifters, addSelectedLifter } = useSelectedLifter();
	const options = [
		{ label: "Option 1", value: 1 },
		{ label: "Option 2", value: 2 },
		{ label: "Option 3", value: 3 },
	];

	return (
		<section className="p-4 mt-8">
			<h2 className="text-2xl font-bold">
				Voorspelling van zwaarste totaal van jouw geselecteerde top 3:
			</h2>
			<ol className="p-4 flex flex-col gap-4">
				{selectedLifters.map((lifter) => (
					<div key={lifter.name} className="">
						<SelectButton
							value={selectedLifters.map(
								(lifter) => lifter.bestLifter
							)}
							options={options}
						/>

						<li key={lifter.name}>{lifter.name}</li>
						<div className="">
							<InputControls
								label="Total"
								defaultValue={lifter.total}
							/>
						</div>
					</div>
				))}
			</ol>
		</section>
	);
};

export default LiftersList;
