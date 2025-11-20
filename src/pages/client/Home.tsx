import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Radio, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ClientHome() {
  const upcomingEvents = [
    { id: 1, name: "City Marathon 2024", date: "Jan 15, 2024", distance: "42.2 km", status: "registered" },
    { id: 2, name: "Trail Run Challenge", date: "Jan 22, 2024", distance: "21 km", status: "pending" },
  ];

  const activeEvent = {
    id: 1,
    name: "City Marathon 2024",
    date: "Jan 15, 2024",
    techStatus: "RFID tag assigned",
  };

  const hardwareStatus = {
    rfidTag: "Assigned - #12345",
    node: "Available for pickup",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back, Runner!</h1>
        <p className="text-muted-foreground mt-2">Track your events and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 upcoming, 1 pending</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hardware Status</CardTitle>
            <Radio className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">RFID tag assigned</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Event</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">City Marathon 2024</p>
          </CardContent>
        </Card>
      </div>

      {activeEvent && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Active Event
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{activeEvent.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {activeEvent.date}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{activeEvent.techStatus}</Badge>
            </div>
            <Button asChild className="w-full">
              <Link to={`/client/events/${activeEvent.id}`}>View Event Details</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-semibold">{event.name}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.distance}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={event.status === "registered" ? "default" : "secondary"}>
                  {event.status}
                </Badge>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/client/events/${event.id}`}>Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hardware Assignment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">RFID Tag</span>
            <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
              {hardwareStatus.rfidTag}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Running Node</span>
            <Badge variant="secondary">{hardwareStatus.node}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button asChild className="flex-1">
          <Link to="/client/events">Browse Events</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to="/client/profile">My Profile</Link>
        </Button>
      </div>
    </div>
  );
}
