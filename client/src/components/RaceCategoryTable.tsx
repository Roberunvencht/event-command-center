import { Event, RaceCategory } from "@/types/event";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/stores/user";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { Registration } from "@/types/registration";
import axiosInstance from "@/api/axios";
import { Badge } from "./ui/badge";

type RaceCategoryTableProps = {
  categories: RaceCategory[];
  event: Event;
};

export default function RaceCategoryTable({
  categories,
  event,
}: RaceCategoryTableProps) {
  const { user } = useUserStore((state) => state);

  const { data: registration } = useQuery({
    queryKey: [
      QUERY_KEYS.REGISTRATIONS,
      { userID: user._id, eventID: event._id },
    ],
    queryFn: async (): Promise<Registration> => {
      const { data } = await axiosInstance.get(`/registration`, {
        params: { userID: user._id, eventID: event._id },
      });
      return data.data[0] || null;
    },
  });

  const registrationID =
    typeof registration?.raceCategory === "string"
      ? registration?.raceCategory
      : registration?.raceCategory?._id;

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
            <TableCell>
              {cat.name}
              {registrationID === cat._id && (
                <Badge className='ml-2'>Registered</Badge>
              )}
            </TableCell>
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
