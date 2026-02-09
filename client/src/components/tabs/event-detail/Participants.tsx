import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Participant } from "@/types/participant";
import { RegisterEventDialog } from "@/components/forms/RegisterEventForm";
import { Event } from "@/types/event";

// Schema for full registration (manager registering participant)
const participantSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  emergencyName: z
    .string()
    .min(2, "Emergency contact name is required")
    .max(100),
  emergencyPhone: z
    .string()
    .min(10, "Emergency contact phone is required")
    .max(20),
  medicalConditions: z.string().max(500).optional(),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  category: z.enum(["full-marathon", "half-marathon", "10k"]),
  bibNumber: z.string().min(1, "Bib number is required").max(10),
  deviceType: z.enum(["rfid", "running-node", "hybrid"]),
  deviceId: z.string().min(1, "Device ID is required").max(50),
  rfidTagId: z.string().min(1, "RFID Tag ID is required").max(50),
});
type ParticipantFormData = z.infer<typeof participantSchema>;

type ParticipantsProps = {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  selectedParticipant: Participant | null;
  setSelectedParticipant: React.Dispatch<
    React.SetStateAction<Participant | null>
  >;
  event: Event;
};

export default function Participants({
  participants,
  setParticipants,
  selectedParticipant,
  setSelectedParticipant,
  event,
}: ParticipantsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const addForm = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      emergencyName: "",
      emergencyPhone: "",
      medicalConditions: "",
      tshirtSize: "M",
      category: "full-marathon",
      bibNumber: "",
      deviceType: "rfid",
      deviceId: "",
      rfidTagId: "",
    },
  });

  const editForm = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      emergencyName: "",
      emergencyPhone: "",
      medicalConditions: "",
      tshirtSize: "M",
      category: "full-marathon",
      bibNumber: "",
      deviceType: "rfid",
      deviceId: "",
      rfidTagId: "",
    },
  });

  const handleDeleteParticipant = (participant: Participant) => {
    setParticipants(participants.filter((p) => p.id !== participant.id));
    toast({
      title: "Participant Removed",
      description: `${participant.firstName} ${participant.lastName} has been removed from the event.`,
      variant: "destructive",
    });
  };

  const handleAddParticipant = (data: ParticipantFormData) => {
    const newParticipant: Participant = {
      id: participants.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
      medicalConditions: data.medicalConditions,
      tshirtSize: data.tshirtSize,
      bibNumber: data.bibNumber,
      deviceType:
        data.deviceType === "running-node"
          ? "Running Node"
          : data.deviceType === "rfid"
            ? "RFID"
            : "Hybrid",
      deviceId: data.deviceId,
      rfidTagId: data.rfidTagId,
      category:
        data.category === "full-marathon"
          ? "Full Marathon"
          : data.category === "half-marathon"
            ? "Half Marathon"
            : "10K",
      status: "registered",
      isAssigned: true,
    };

    setParticipants([...participants, newParticipant]);
    toast({
      title: "Participant Registered",
      description: `${data.firstName} ${data.lastName} has been registered with bib #${data.bibNumber}.`,
    });
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  const openEditDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    const deviceTypeValue = participant.deviceType
      .toLowerCase()
      .replace(" ", "-") as "rfid" | "running-node" | "hybrid";
    const categoryValue = participant.category
      .toLowerCase()
      .replace(" ", "-") as "full-marathon" | "half-marathon" | "10k";
    const tshirtValue = participant.tshirtSize as
      | "XS"
      | "S"
      | "M"
      | "L"
      | "XL"
      | "XXL";

    editForm.reset({
      firstName: participant.firstName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      emergencyName: participant.emergencyName,
      emergencyPhone: participant.emergencyPhone,
      medicalConditions: participant.medicalConditions || "",
      tshirtSize: tshirtValue,
      bibNumber: participant.bibNumber,
      deviceType: deviceTypeValue || "rfid",
      deviceId: participant.deviceId,
      rfidTagId: participant.rfidTagId,
      category: categoryValue,
    });
    setIsEditDialogOpen(true);
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
            emergencyName: data.emergencyName,
            emergencyPhone: data.emergencyPhone,
            medicalConditions: data.medicalConditions,
            tshirtSize: data.tshirtSize,
            bibNumber: data.bibNumber,
            deviceType:
              data.deviceType === "running-node"
                ? "Running Node"
                : data.deviceType === "rfid"
                  ? "RFID"
                  : "Hybrid",
            deviceId: data.deviceId,
            rfidTagId: data.rfidTagId,
            category:
              data.category === "full-marathon"
                ? "Full Marathon"
                : data.category === "half-marathon"
                  ? "Half Marathon"
                  : "10K",
          }
        : p,
    );

    setParticipants(updatedParticipants);
    toast({
      title: "Participant Updated",
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedParticipant(null);
  };

  const filteredParticipants = participants.filter(
    (p) =>
      p.isAssigned &&
      (p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bibNumber.includes(searchQuery) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <CardTitle>Manage Registrations</CardTitle>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search participants...'
                className='pl-9 w-[250px]'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <RegisterEventDialog event={event} />
            {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
							<DialogTrigger asChild>
								<Button className='gap-2'>
									<Plus className='w-4 h-4' />
									Register Participant
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
								<DialogHeader>
									<DialogTitle>Register New Participant</DialogTitle>
									<DialogDescription>
										Register a client for this event and assign their device,
										bib number, and RFID tag.
									</DialogDescription>
								</DialogHeader>
								<Form {...addForm}>
									<form onSubmit={addForm.handleSubmit(handleAddParticipant)}>
										<ParticipantFormFields form={addForm} />
										<div className='flex justify-end gap-2 mt-4'>
											<Button
												type='button'
												variant='outline'
												onClick={() => setIsAddDialogOpen(false)}
											>
												Cancel
											</Button>
											<Button type='submit'>Register Participant</Button>
										</div>
									</form>
								</Form>
							</DialogContent>
						</Dialog> */}
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
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className='font-medium'>
                  {participant.bibNumber}
                </TableCell>
                <TableCell>
                  {participant.firstName} {participant.lastName}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {participant.email}
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{participant.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>{participant.deviceType}</Badge>
                </TableCell>
                <TableCell className='font-mono text-sm'>
                  {participant.deviceId}
                </TableCell>
                <TableCell className='font-mono text-sm'>
                  {participant.rfidTagId}
                </TableCell>
                <TableCell>
                  <Badge className='bg-teal-500/20 text-teal-700 dark:text-teal-300'>
                    {participant.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => openEditDialog(participant)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDeleteParticipant(participant)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredParticipants.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='text-center py-8 text-muted-foreground'
                >
                  No participants found. Click "Register Participant" to add
                  one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Edit Participant Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Edit Participant</DialogTitle>
              <DialogDescription>
                Update participant information and device assignments.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditParticipant)}>
                <ParticipantFormFields form={editForm} />
                <div className='flex justify-end gap-2 mt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>Save Changes</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

const ParticipantFormFields = ({
  form,
}: {
  form: ReturnType<typeof useForm<ParticipantFormData>>;
}) => (
  <div className='grid gap-4 py-4'>
    {/* Personal Information */}
    <div className='space-y-4'>
      <h4 className='font-medium text-foreground'>Personal Information</h4>
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type='email' placeholder='john@example.com' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='phone'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder='1234567890' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Emergency Contact */}
    <div className='border-t pt-4 space-y-4'>
      <h4 className='font-medium text-foreground'>Emergency Contact</h4>
      <FormField
        control={form.control}
        name='emergencyName'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Name</FormLabel>
            <FormControl>
              <Input placeholder='Jane Doe' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='emergencyPhone'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emergency Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder='1234567891' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Additional Information */}
    <div className='border-t pt-4 space-y-4'>
      <h4 className='font-medium text-foreground'>Additional Information</h4>
      <FormField
        control={form.control}
        name='medicalConditions'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medical Conditions (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Any medical conditions, allergies, or information we should know...'
                className='resize-none'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='tshirtSize'
          render={({ field }) => (
            <FormItem>
              <FormLabel>T-Shirt Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select size' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='XS'>XS</SelectItem>
                  <SelectItem value='S'>S</SelectItem>
                  <SelectItem value='M'>M</SelectItem>
                  <SelectItem value='L'>L</SelectItem>
                  <SelectItem value='XL'>XL</SelectItem>
                  <SelectItem value='XXL'>XXL</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='full-marathon'>
                    Full Marathon (42.2 km)
                  </SelectItem>
                  <SelectItem value='half-marathon'>
                    Half Marathon (21.1 km)
                  </SelectItem>
                  <SelectItem value='10k'>10K</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Device Assignment */}
    <div className='border-t pt-4 space-y-4'>
      <h4 className='font-medium text-foreground'>Device Assignment</h4>

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='bibNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bib Number</FormLabel>
              <FormControl>
                <Input placeholder='001' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='deviceType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select device' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='rfid'>RFID Only</SelectItem>
                  <SelectItem value='running-node'>Running Node</SelectItem>
                  <SelectItem value='hybrid'>Hybrid (RFID + Node)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='deviceId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device ID</FormLabel>
              <FormControl>
                <Input placeholder='DEV-001' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rfidTagId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFID Tag ID</FormLabel>
              <FormControl>
                <Input placeholder='RFID-001' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </div>
);
