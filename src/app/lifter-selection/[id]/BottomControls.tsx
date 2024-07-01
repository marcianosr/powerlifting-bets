"use client";
import React from "react";

import { WeightClass, weightClass } from "@/app/support";
import Link from "next/link";
import { Button } from "primereact/button";
import classNames from "classnames";
import { useSelectedLifter } from "../LifterSelectionProvider";

const BottomControls = ({ id }: { id: WeightClass }) => {
	const findIndexForWeightClass = weightClass.findIndex((w) => w === id);
	const { disableNextSteps } = useSelectedLifter();

	const isDisabled = disableNextSteps(id);
	return (
		<div className="flex justify-between mt-4">
			{findIndexForWeightClass > 0 && (
				<Link
					href={`/lifter-selection/${
						weightClass[findIndexForWeightClass - 1]
					}`}
				>
					<Button>
						Terug naar -{weightClass[findIndexForWeightClass - 1]}
					</Button>
				</Link>
			)}

			{findIndexForWeightClass < weightClass.length - 1 && (
				<Link
					className={classNames("ml-auto", {
						["pointer-events-none opacity-50"]: isDisabled,
					})}
					href={`/lifter-selection/${
						weightClass[findIndexForWeightClass + 1]
					}`}
				>
					<Button disabled={isDisabled}>
						Verder naar -{weightClass[findIndexForWeightClass + 1]}
					</Button>
				</Link>
			)}
		</div>
	);
};

export default BottomControls;
