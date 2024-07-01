import { faker } from "@faker-js/faker";
import { WeightClass, weightClass } from "./support";

export default function Home() {
	return <main className="p-4">Overview</main>;
}

export const generateFakeLifterNominations = (
	indexWeightclass: WeightClass
) => {
	const name = faker.person.fullName();

	const generateRoundedNumber = (min: number, max: number) => {
		const num = faker.number.int({ min: min / 2.5, max: max / 2.5 });
		return Math.round(num) * 2.5;
	};

	const squat = generateRoundedNumber(70, 260);
	const bench = generateRoundedNumber(50, 200);
	const deadlift = generateRoundedNumber(100, 330);
	const wc = weightClass.find((w) => w === indexWeightclass);

	const total = squat + bench + deadlift;

	return {
		name,
		weightClass: wc,
		squat,
		bench,
		deadlift,
		total,
	};
};
