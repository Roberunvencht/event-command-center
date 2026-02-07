import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Clock, Heart, Zap, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RaceParticipation() {
  const raceData = {
    eventName: "City Marathon 2024",
    deviceType: "Running Node",
    currentPosition: "3rd Place",
    distance: "28.5 km",
    totalDistance: "42.2 km",
    timeElapsed: "2:15:30",
    pace: "4:45 min/km",
    nextCheckpoint: "Checkpoint 3 - Bridge Plaza",
    distanceToCheckpoint: "3.5 km",
    estimatedTime: "16 minutes",
  };

  const bioSignals = {
    heartRate: 145,
    heartRateZone: "Moderate",
    emg: "Normal",
    warning: null,
  };

  const checkpoints = [
    { name: "Start Line", status: "completed", time: "6:00:00" },
    { name: "Checkpoint 1", status: "completed", time: "6:47:30" },
    { name: "Checkpoint 2", status: "completed", time: "7:35:45" },
    { name: "Checkpoint 3", status: "approaching", time: "-" },
    { name: "Finish Line", status: "pending", time: "-" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{raceData.eventName}</h1>
          <p className="text-muted-foreground mt-2">Live Race Tracking</p>
        </div>
        <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300 text-lg px-4 py-2">
          LIVE
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Position</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raceData.currentPosition}</div>
            <p className="text-xs text-muted-foreground">Overall ranking</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Elapsed</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raceData.timeElapsed}</div>
            <p className="text-xs text-muted-foreground">Pace: {raceData.pace}</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bioSignals.heartRate} BPM</div>
            <p className="text-xs text-muted-foreground">{bioSignals.heartRateZone} zone</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Race Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Distance Covered</span>
              <span className="text-primary font-bold">
                {raceData.distance} / {raceData.totalDistance}
              </span>
            </div>
            <Progress value={(parseFloat(raceData.distance) / parseFloat(raceData.totalDistance)) * 100} />
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="text-sm font-medium">Next Checkpoint</p>
              <p className="text-sm text-muted-foreground">{raceData.nextCheckpoint}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{raceData.distanceToCheckpoint}</p>
              <p className="text-xs text-muted-foreground">~{raceData.estimatedTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {raceData.deviceType === "Running Node" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Live Location Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 animate-pulse text-primary" />
                  <p>Real-time location tracking</p>
                  <p className="text-sm">Your position on the race route</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Bio Signal Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  <p className="text-2xl font-bold">{bioSignals.heartRate} BPM</p>
                  <p className="text-sm text-muted-foreground">{bioSignals.heartRateZone}</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">EMG Signal</span>
                  </div>
                  <p className="text-2xl font-bold">{bioSignals.emg}</p>
                  <p className="text-sm text-muted-foreground">Muscle activity</p>
                </div>
              </div>
              {bioSignals.warning && (
                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {bioSignals.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Checkpoint Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checkpoints.map((checkpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      checkpoint.status === "completed"
                        ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                        : checkpoint.status === "approaching"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{checkpoint.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{checkpoint.time}</span>
                  <Badge
                    variant={checkpoint.status === "completed" ? "default" : "secondary"}
                    className={
                      checkpoint.status === "completed"
                        ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                        : checkpoint.status === "approaching"
                        ? "bg-primary/20 text-primary"
                        : ""
                    }
                  >
                    {checkpoint.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
