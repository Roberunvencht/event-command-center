import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function ClientEventList() {
  const events = [
    {
      id: 1,
      name: "City Marathon 2024",
      date: "Jan 15, 2024",
      distance: "42.2 km",
      location: "Downtown",
      techRequired: "RFID",
      organizer: "Running Club",
      status: "registered",
      spotsLeft: 45,
    },
    {
      id: 2,
      name: "Trail Run Challenge",
      date: "Jan 22, 2024",
      distance: "21 km",
      location: "Forest Park",
      techRequired: "Hybrid",
      organizer: "Trail Masters",
      status: "open",
      spotsLeft: 120,
    },
    {
      id: 3,
      name: "Sprint Series #1",
      date: "Jan 29, 2024",
      distance: "10 km",
      location: "City Stadium",
      techRequired: "Running Node",
      organizer: "Speed Demons",
      status: "open",
      spotsLeft: 80,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Available Events</h1>
          <p className="text-muted-foreground mt-2">Register for upcoming running events</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search events..." className="max-w-sm" />
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id} className="border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{event.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Organized by {event.organizer}</p>
                </div>
                <Badge
                  variant={event.status === "registered" ? "default" : "secondary"}
                  className={event.status === "registered" ? "bg-teal-500/20 text-teal-700 dark:text-teal-300" : ""}
                >
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Radio className="w-4 h-4 text-primary" />
                  <span>{event.techRequired}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-primary">{event.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {event.spotsLeft} spots remaining
                </span>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/client/events/${event.id}`}>View Details</Link>
                  </Button>
                  {event.status === "open" ? (
                    <Button size="sm">Register</Button>
                  ) : (
                    <Button size="sm" variant="secondary">Registered</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
