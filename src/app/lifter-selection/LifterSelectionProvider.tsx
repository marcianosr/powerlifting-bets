// src/context/LifterSelectionProvider.js
import React, { createContext, useState, useContext } from "react";
import { SelectedLifter, WeightClass } from "@/app/support";

type LifterSelectionProviderType = {
	selectedLifters: SelectedLifter[];
	addSelectedLifter: (Lifters: SelectedLifter[]) => void;
	disableNextSteps: (id: WeightClass) => boolean;
};

const LifterSelectionProvider = createContext<LifterSelectionProviderType>({
	selectedLifters: [],
	addSelectedLifter: () => {},
	disableNextSteps: () => false,
});

export const SelectedLifterProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [selectedLifters, setSelectedLifters] = useState<SelectedLifter[]>(
		[]
	);

	console.log(selectedLifters);

	const addSelectedLifter = (lifters: SelectedLifter[]) => {
		setSelectedLifters(lifters);
	};

	const disableNextSteps = (id: WeightClass) =>
		selectedLifters.filter((lifter) => lifter.weightClass === id).length <
		3;

	return (
		<LifterSelectionProvider.Provider
			value={{ selectedLifters, addSelectedLifter, disableNextSteps }}
		>
			{children}
		</LifterSelectionProvider.Provider>
	);
};

export const useSelectedLifter = () => {
	const context = useContext(LifterSelectionProvider);

	if (context === undefined) {
		throw new Error(
			"useSelectedLifter must be used within a SelectedLifterProvider"
		);
	}

	return context;
};
