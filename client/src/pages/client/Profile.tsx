import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Radio, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const profile = {
    name: "Alex Runner",
    email: "alex.runner@example.com",
    phone: "+1 (555) 123-4567",
    memberSince: "Dec 2023",
  };

  const hardwareHistory = [
    { date: "Jan 15, 2024", event: "City Marathon 2024", device: "RFID Tag #12345", status: "In Use" },
    { date: "Dec 22, 2023", event: "Trail Run Challenge", device: "Running Node #89", status: "Returned" },
    { date: "Dec 8, 2023", event: "Sprint Series #3", device: "RFID Tag #67890", status: "Returned" },
  ];

  const registeredEvents = [
    { name: "City Marathon 2024", date: "Jan 15, 2024", status: "Active" },
    { name: "Trail Run Challenge", date: "Jan 22, 2024", status: "Registered" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={profile.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={profile.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={profile.phone} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Member since {profile.memberSince}</span>
            </div>
            <Button className="w-full">Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified before events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Race Updates</Label>
                <p className="text-sm text-muted-foreground">Live updates during races</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hardware Notifications</Label>
                <p className="text-sm text-muted-foreground">Device pickup reminders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Results & Leaderboards</Label>
                <p className="text-sm text-muted-foreground">When results are published</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">News and promotions</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {registeredEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-border rounded-lg"
            >
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <Badge
                variant={event.status === "Active" ? "default" : "secondary"}
                className={
                  event.status === "Active"
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                    : ""
                }
              >
                {event.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary" />
            Hardware Assignment History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hardwareHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{item.event}</p>
                <p className="text-sm text-muted-foreground">{item.device}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <Badge
                variant={item.status === "In Use" ? "default" : "secondary"}
                className={
                  item.status === "In Use"
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                    : ""
                }
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
