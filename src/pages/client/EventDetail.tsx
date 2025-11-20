import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Radio, CheckCircle, Clock, Info } from "lucide-react";

export default function ClientEventDetail() {
  const { id } = useParams();

  const event = {
    id: id,
    name: "City Marathon 2024",
    date: "Jan 15, 2024",
    time: "6:00 AM",
    distance: "42.2 km",
    location: "Downtown - City Hall Start",
    techRequired: "RFID",
    organizer: "Running Club",
    registrationStatus: "approved",
    techAssignment: "RFID Tag #12345",
    pickupLocation: "City Hall - Equipment Desk",
    pickupTime: "Jan 14, 2024 - 2:00 PM to 8:00 PM",
  };

  const checkpoints = [
    { id: 1, name: "Start Line", location: "City Hall", gps: "40.7128° N, 74.0060° W", distance: "0 km" },
    { id: 2, name: "Checkpoint 1", location: "Central Park", gps: "40.7829° N, 73.9654° W", distance: "10 km" },
    { id: 3, name: "Checkpoint 2", location: "Riverside Drive", gps: "40.8075° N, 73.9626° W", distance: "21 km" },
    { id: 4, name: "Checkpoint 3", location: "Bridge Plaza", gps: "40.7061° N, 74.0087° W", distance: "32 km" },
    { id: 5, name: "Finish Line", location: "City Hall", gps: "40.7128° N, 74.0060° W", distance: "42.2 km" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{event.name}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {event.date} at {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
          <span className="text-primary font-medium">{event.distance}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              Registration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
                {event.registrationStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Tech Assignment</p>
              <Badge variant="outline">{event.techAssignment}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" />
              Hardware Pickup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Location</p>
              <p className="text-sm text-muted-foreground">{event.pickupLocation}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Pickup Time</p>
              <p className="text-sm text-muted-foreground">{event.pickupTime}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Route & Checkpoints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Route map preview</p>
              <p className="text-sm">View full route on race day</p>
            </div>
          </div>

          <div className="space-y-2">
            {checkpoints.map((checkpoint, index) => (
              <div
                key={checkpoint.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{checkpoint.name}</p>
                    <p className="text-sm text-muted-foreground">{checkpoint.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{checkpoint.distance}</p>
                  <p className="text-xs text-muted-foreground">{checkpoint.gps}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Event Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Pick up your RFID tag from the equipment desk before race day</p>
          <p>• Attach the RFID tag securely to your running bib</p>
          <p>• Arrive at least 30 minutes before the start time</p>
          <p>• Warm up area available at City Hall Plaza</p>
          <p>• Water stations available at each checkpoint</p>
          <p>• Medical support stationed along the route</p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button className="flex-1">View on Live Race Day</Button>
        <Button variant="outline" className="flex-1">Download Event Info</Button>
      </div>
    </div>
  );
}
