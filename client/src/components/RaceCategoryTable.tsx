import { RaceCategory } from '@/types/event';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

type RaceCategoryTableProps = {
	categories: RaceCategory[];
};

export default function RaceCategoryTable({
	categories,
}: RaceCategoryTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Category</TableHead>
					<TableHead>Distance</TableHead>
					<TableHead>Slots</TableHead>
					<TableHead>Registered</TableHead>
					<TableHead>Price</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{categories.map((cat) => (
					<TableRow key={cat._id}>
						<TableCell>{cat.name}</TableCell>
						<TableCell>{cat.distanceKm}K</TableCell>
						<TableCell>{cat.slots}</TableCell>
						<TableCell>{cat.registeredCount}</TableCell>
						<TableCell>₱{cat.price}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
