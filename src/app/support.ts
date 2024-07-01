export const weightClass = [
	"59",
	"66",
	"74",
	"83",
	"93",
	"105",
	"120",
	"120+",
] as const;

export type WeightClass = (typeof weightClass)[number];

export type Lifter = {
	name: string;
	weightClass: WeightClass;
	squat: number;
	bench: number;
	deadlift: number;
	total: number;
};

export type SelectedLifter = Lifter & {
	predictions: {
		squat: number;
		bench: number;
		deadlift: number;
		total: number;
	};
	bestLifter: Lifter[];
};
