import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Users, Trophy, Activity } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();

  // Mock data - replace with actual data fetching
  const event = {
    id: id,
    name: "City Marathon 2024",
    date: "Jan 15, 2024",
    distance: "42.2 km",
    location: "Downtown",
  };

  const participants = [
    { id: 1, name: "John Doe", bibNumber: "001", device: "RFID", status: "active" },
    { id: 2, name: "Jane Smith", bibNumber: "002", device: "Running Node", status: "active" },
    { id: 3, name: "Mike Johnson", bibNumber: "003", device: "Hybrid", status: "active" },
  ];

  const leaderboard = [
    { rank: 1, name: "John Doe", bibNumber: "001", time: "2:15:30", lastCheckpoint: "CP-5" },
    { rank: 2, name: "Jane Smith", bibNumber: "002", time: "2:18:45", lastCheckpoint: "CP-5" },
    { rank: 3, name: "Mike Johnson", bibNumber: "003", time: "2:22:10", lastCheckpoint: "CP-4" },
  ];

  const runnerStatus = [
    { bibNumber: "001", name: "John Doe", rfidStatus: "Active", heartRate: 145, lastSeen: "2 min ago" },
    { bibNumber: "002", name: "Jane Smith", rfidStatus: "Active", heartRate: 152, lastSeen: "1 min ago" },
    { bibNumber: "003", name: "Mike Johnson", rfidStatus: "Active", heartRate: 138, lastSeen: "3 min ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{event.name}</h1>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
          <span>{event.date}</span>
          <span className="text-primary font-medium">{event.distance}</span>
        </div>
      </div>

      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants">
            <Users className="w-4 h-4 mr-2" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapPin className="w-4 h-4 mr-2" />
            Map Track
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="status">
            <Activity className="w-4 h-4 mr-2" />
            Runner Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bib #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.bibNumber}</TableCell>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{participant.device}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
                          {participant.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Race Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Map visualization will be displayed here</p>
                  <p className="text-sm">Integration with mapping service pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Bib #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Last Checkpoint</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((runner) => (
                    <TableRow key={runner.rank}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {runner.rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                          <span className="font-bold">{runner.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{runner.bibNumber}</TableCell>
                      <TableCell>{runner.name}</TableCell>
                      <TableCell className="font-mono">{runner.time}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{runner.lastCheckpoint}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>RFID & Biosignal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bib #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>RFID Status</TableHead>
                    <TableHead>Heart Rate (BPM)</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runnerStatus.map((runner) => (
                    <TableRow key={runner.bibNumber}>
                      <TableCell className="font-medium">{runner.bibNumber}</TableCell>
                      <TableCell>{runner.name}</TableCell>
                      <TableCell>
                        <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
                          {runner.rfidStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-red-500" />
                          <span className="font-mono">{runner.heartRate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{runner.lastSeen}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
