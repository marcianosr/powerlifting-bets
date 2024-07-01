import { generateFakeLifterNominations } from "@/app/page";
import { WeightClass } from "@/app/support";
import TablePage from "./TablePage";

export default function Page({ params }: { params: { id: WeightClass } }) {
	const lifters = Array.from({ length: 12 }, () =>
		generateFakeLifterNominations(params.id)
	).sort((a, b) => Number(a.weightClass) - Number(b.weightClass));

	const sortedByTotal = lifters.sort((a, b) => b.total - a.total);

	return <TablePage data={sortedByTotal} params={params} />;
}
