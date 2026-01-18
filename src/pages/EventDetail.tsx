import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Users, Trophy, Activity, Plus, Edit, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const participantSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  bibNumber: z.string().min(1, "Bib number is required").max(10),
  deviceType: z.enum(["rfid", "running-node", "hybrid"]),
  deviceId: z.string().min(1, "Device ID is required").max(50),
  rfidTagId: z.string().min(1, "RFID Tag ID is required").max(50),
  category: z.enum(["full-marathon", "half-marathon", "10k"]),
});

type ParticipantFormData = z.infer<typeof participantSchema>;

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bibNumber: string;
  deviceType: string;
  deviceId: string;
  rfidTagId: string;
  category: string;
  status: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data fetching
  const event = {
    id: id,
    name: "City Marathon 2024",
    date: "Jan 15, 2024",
    distance: "42.2 km",
    location: "Downtown",
  };

  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: 1, 
      firstName: "John", 
      lastName: "Doe", 
      email: "john.doe@email.com",
      phone: "1234567890",
      bibNumber: "001", 
      deviceType: "RFID", 
      deviceId: "DEV-001",
      rfidTagId: "RFID-001",
      category: "Full Marathon",
      status: "registered" 
    },
    { 
      id: 2, 
      firstName: "Jane", 
      lastName: "Smith", 
      email: "jane.smith@email.com",
      phone: "0987654321",
      bibNumber: "002", 
      deviceType: "Running Node", 
      deviceId: "DEV-002",
      rfidTagId: "RFID-002",
      category: "Half Marathon",
      status: "registered" 
    },
    { 
      id: 3, 
      firstName: "Mike", 
      lastName: "Johnson", 
      email: "mike.johnson@email.com",
      phone: "5555555555",
      bibNumber: "003", 
      deviceType: "Hybrid", 
      deviceId: "DEV-003",
      rfidTagId: "RFID-003",
      category: "10K",
      status: "registered" 
    },
  ]);

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

  const addForm = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bibNumber: "",
      deviceType: "rfid",
      deviceId: "",
      rfidTagId: "",
      category: "full-marathon",
    },
  });

  const editForm = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bibNumber: "",
      deviceType: "rfid",
      deviceId: "",
      rfidTagId: "",
      category: "full-marathon",
    },
  });

  const handleAddParticipant = (data: ParticipantFormData) => {
    const newParticipant: Participant = {
      id: participants.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      bibNumber: data.bibNumber,
      deviceType: data.deviceType === "running-node" ? "Running Node" : 
                  data.deviceType === "rfid" ? "RFID" : "Hybrid",
      deviceId: data.deviceId,
      rfidTagId: data.rfidTagId,
      category: data.category === "full-marathon" ? "Full Marathon" :
                data.category === "half-marathon" ? "Half Marathon" : "10K",
      status: "registered",
    };
    
    setParticipants([...participants, newParticipant]);
    toast({
      title: "Participant Registered",
      description: `${data.firstName} ${data.lastName} has been registered with bib #${data.bibNumber}.`,
    });
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  const handleEditParticipant = (data: ParticipantFormData) => {
    if (!selectedParticipant) return;

    const updatedParticipants = participants.map((p) =>
      p.id === selectedParticipant.id
        ? {
            ...p,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            bibNumber: data.bibNumber,
            deviceType: data.deviceType === "running-node" ? "Running Node" : 
                        data.deviceType === "rfid" ? "RFID" : "Hybrid",
            deviceId: data.deviceId,
            rfidTagId: data.rfidTagId,
            category: data.category === "full-marathon" ? "Full Marathon" :
                      data.category === "half-marathon" ? "Half Marathon" : "10K",
          }
        : p
    );

    setParticipants(updatedParticipants);
    toast({
      title: "Participant Updated",
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedParticipant(null);
  };

  const handleDeleteParticipant = (participant: Participant) => {
    setParticipants(participants.filter((p) => p.id !== participant.id));
    toast({
      title: "Participant Removed",
      description: `${participant.firstName} ${participant.lastName} has been removed from the event.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    const deviceTypeValue = participant.deviceType.toLowerCase().replace(" ", "-") as "rfid" | "running-node" | "hybrid";
    const categoryValue = participant.category.toLowerCase().replace(" ", "-") as "full-marathon" | "half-marathon" | "10k";
    
    editForm.reset({
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      bibNumber: participant.bibNumber,
      deviceType: deviceTypeValue,
      deviceId: participant.deviceId,
      rfidTagId: participant.rfidTagId,
      category: categoryValue,
    });
    setIsEditDialogOpen(true);
  };

  const filteredParticipants = participants.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bibNumber.includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ParticipantFormFields = ({ form }: { form: ReturnType<typeof useForm<ParticipantFormData>> }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="full-marathon">Full Marathon (42.2 km)</SelectItem>
                <SelectItem value="half-marathon">Half Marathon (21.1 km)</SelectItem>
                <SelectItem value="10k">10K</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="border-t pt-4 mt-2">
        <h4 className="font-medium mb-4 text-foreground">Device Assignment</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bibNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bib Number</FormLabel>
                <FormControl>
                  <Input placeholder="001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rfid">RFID Only</SelectItem>
                    <SelectItem value="running-node">Running Node</SelectItem>
                    <SelectItem value="hybrid">Hybrid (RFID + Node)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="deviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device ID</FormLabel>
                <FormControl>
                  <Input placeholder="DEV-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rfidTagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFID Tag ID</FormLabel>
                <FormControl>
                  <Input placeholder="RFID-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Manage Registrations</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search participants..."
                      className="pl-9 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Register Participant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Register New Participant</DialogTitle>
                        <DialogDescription>
                          Register a client for this event and assign their device, bib number, and RFID tag.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addForm}>
                        <form onSubmit={addForm.handleSubmit(handleAddParticipant)}>
                          <ParticipantFormFields form={addForm} />
                          <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Register Participant</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bib #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Device Type</TableHead>
                    <TableHead>Device ID</TableHead>
                    <TableHead>RFID Tag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell className="font-medium">{participant.bibNumber}</TableCell>
                      <TableCell>{participant.firstName} {participant.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{participant.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{participant.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{participant.deviceType}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{participant.deviceId}</TableCell>
                      <TableCell className="font-mono text-sm">{participant.rfidTagId}</TableCell>
                      <TableCell>
                        <Badge className="bg-teal-500/20 text-teal-700 dark:text-teal-300">
                          {participant.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(participant)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteParticipant(participant)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredParticipants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No participants found. Click "Register Participant" to add one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Participant Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Participant</DialogTitle>
              <DialogDescription>
                Update participant information and device assignments.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditParticipant)}>
                <ParticipantFormFields form={editForm} />
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

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
