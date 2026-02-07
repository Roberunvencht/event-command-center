import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Download, UserPlus, MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Participants() {
  const participants = [
    { id: "001", name: "Mark Juan Madeja", team: "None", category: "Full Marathon", status: "finished" as const },
    { id: "002", name: "Zaid Rifath", team: "None", category: "Full Marathon", status: "finished" as const },
    { id: "003", name: "Wajahat Amna Khalid", team: "A Team", category: "Full Marathon", status: "finished" as const },
    { id: "004", name: "Tom Ana Andres", team: "A Team", category: "10km", status: "active" as const },
    { id: "005", name: "John Proud Gold", team: "B Team", category: "Half Marathon", status: "active" as const },
    { id: "006", name: "Christine Cruz Camden", team: "B Team", category: "10km", status: "finished" as const },
    { id: "007", name: "Shayn Bernidez Bernado", team: "None", category: "10km", status: "finished" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Participants</h1>
          <p className="text-muted-foreground">Manage all event participants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Participant
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, bib number, team..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Bib No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{participant.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{participant.name}</TableCell>
                    <TableCell className="text-muted-foreground">{participant.team}</TableCell>
                    <TableCell className="text-muted-foreground">{participant.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={participant.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Participant</DropdownMenuItem>
                          <DropdownMenuItem>Assign Hardware</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
