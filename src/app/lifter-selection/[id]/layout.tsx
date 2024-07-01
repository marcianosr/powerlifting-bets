"use client";
import { WeightClass, weightClass } from "@/app/support";
import { useParams } from "next/navigation";
import { SelectedLifterProvider } from "@/app/lifter-selection/LifterSelectionProvider";
import BottomControls from "./BottomControls";
import LiftersList from "./LifterList";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { id } = useParams<{ id: WeightClass }>();

	if (!id || !weightClass.includes(id)) {
		return <div>Invalid weight class</div>;
	}

	return (
		<SelectedLifterProvider>
			<section className="p-4">
				<h1 className="text-2xl font-bold">
					Nominaties -{id}kg klasse
				</h1>
				<small>Selecteer je top 3</small>
				{children}

				<LiftersList />
				<BottomControls id={id} />
			</section>
		</SelectedLifterProvider>
	);
}
