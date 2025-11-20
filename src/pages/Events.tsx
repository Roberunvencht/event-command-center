import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, MapPin, Users, Plus, Search, Filter, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Events() {
  const events = [
    {
      id: 1,
      name: "City Marathon 2024",
      date: "Jan 15, 2024",
      location: "Downtown",
      participants: 420,
      status: "upcoming" as const,
      distance: "42.2 km",
    },
    {
      id: 2,
      name: "Half Marathon Challenge",
      date: "Jan 10, 2024",
      location: "Park Lane",
      participants: 267,
      status: "active" as const,
      distance: "21.1 km",
    },
    {
      id: 3,
      name: "Weekend Sprint",
      date: "Dec 20, 2023",
      location: "City Center",
      participants: 189,
      status: "finished" as const,
      distance: "10 km",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
          <p className="text-muted-foreground">Manage all your race events</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{event.name}</h3>
                    <StatusBadge status={event.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.participants} participants
                    </span>
                    <span className="font-medium text-primary">{event.distance}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                      <DropdownMenuItem>Manage Participants</DropdownMenuItem>
                      <DropdownMenuItem>View Results</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Event</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
