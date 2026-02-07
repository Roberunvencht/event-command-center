import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const upcomingEvents = [
    { id: 1, name: "City Marathon 2024", date: "Jan 15, 2024", location: "Downtown", participants: 420 },
    { id: 2, name: "Trail Run Challenge", date: "Jan 22, 2024", location: "Mountain Park", participants: 156 },
    { id: 3, name: "Night Run Series", date: "Feb 1, 2024", location: "Beach Front", participants: 89 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Participants"
          value="420"
          subtitle="Across all events"
          icon={Users}
        />
        <StatCard
          title="Active Events"
          value="3"
          subtitle="Currently running"
          icon={Calendar}
        />
        <StatCard
          title="Hardware Units"
          value="67"
          subtitle="RFID tags assigned"
          icon={MapPin}
        />
        <StatCard
          title="Success Rate"
          value="98.5%"
          subtitle="Event completion"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Events
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{event.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{event.participants}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Users className="w-4 h-4 mr-2" />
              Manage Participants
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <MapPin className="w-4 h-4 mr-2" />
              View Live Tracking
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "New participant registered", event: "City Marathon 2024", time: "2 mins ago", type: "success" },
              { action: "Event created", event: "Trail Run Challenge", time: "1 hour ago", type: "info" },
              { action: "Hardware assigned", event: "Night Run Series", time: "3 hours ago", type: "info" },
              { action: "Results published", event: "Weekend Sprint", time: "1 day ago", type: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.event}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={activity.type === "success" ? "default" : "outline"}>
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
