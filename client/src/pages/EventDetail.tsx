import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	MapPin,
	Users,
	Trophy,
	Activity,
	Plus,
	Edit,
	Search,
	Trash2,
	UserCheck,
	Tag,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

// Schema for full registration (manager registering participant)
const participantSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.max(50),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.max(50),
	email: z.string().email('Invalid email address').max(255),
	phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
	emergencyName: z
		.string()
		.min(2, 'Emergency contact name is required')
		.max(100),
	emergencyPhone: z
		.string()
		.min(10, 'Emergency contact phone is required')
		.max(20),
	medicalConditions: z.string().max(500).optional(),
	tshirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
	category: z.enum(['full-marathon', 'half-marathon', '10k']),
	bibNumber: z.string().min(1, 'Bib number is required').max(10),
	deviceType: z.enum(['rfid', 'running-node', 'hybrid']),
	deviceId: z.string().min(1, 'Device ID is required').max(50),
	rfidTagId: z.string().min(1, 'RFID Tag ID is required').max(50),
});

// Schema for device assignment only
const deviceAssignmentSchema = z.object({
	bibNumber: z.string().min(1, 'Bib number is required').max(10),
	deviceType: z.enum(['rfid', 'running-node', 'hybrid']),
	deviceId: z.string().min(1, 'Device ID is required').max(50),
	rfidTagId: z.string().min(1, 'RFID Tag ID is required').max(50),
});

type ParticipantFormData = z.infer<typeof participantSchema>;
type DeviceAssignmentFormData = z.infer<typeof deviceAssignmentSchema>;

interface Participant {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	emergencyName: string;
	emergencyPhone: string;
	medicalConditions?: string;
	tshirtSize: string;
	category: string;
	bibNumber: string;
	deviceType: string;
	deviceId: string;
	rfidTagId: string;
	status: string;
	isAssigned: boolean;
}

export default function EventDetail() {
	const { id } = useParams();
	const { toast } = useToast();
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const [selectedParticipant, setSelectedParticipant] =
		useState<Participant | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [pendingSearchQuery, setPendingSearchQuery] = useState('');

	// Mock data - replace with actual data fetching
	const event = {
		id: id,
		name: 'City Marathon 2024',
		date: 'Jan 15, 2024',
		distance: '42.2 km',
		location: 'Downtown',
	};

	const [participants, setParticipants] = useState<Participant[]>([
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john.doe@email.com',
			phone: '1234567890',
			emergencyName: 'Jane Doe',
			emergencyPhone: '1234567891',
			medicalConditions: '',
			tshirtSize: 'L',
			bibNumber: '001',
			deviceType: 'RFID',
			deviceId: 'DEV-001',
			rfidTagId: 'RFID-001',
			category: 'Full Marathon',
			status: 'registered',
			isAssigned: true,
		},
		{
			id: 2,
			firstName: 'Jane',
			lastName: 'Smith',
			email: 'jane.smith@email.com',
			phone: '0987654321',
			emergencyName: 'John Smith',
			emergencyPhone: '0987654322',
			medicalConditions: 'Asthma',
			tshirtSize: 'M',
			bibNumber: '002',
			deviceType: 'Running Node',
			deviceId: 'DEV-002',
			rfidTagId: 'RFID-002',
			category: 'Half Marathon',
			status: 'registered',
			isAssigned: true,
		},
		{
			id: 3,
			firstName: 'Mike',
			lastName: 'Johnson',
			email: 'mike.johnson@email.com',
			phone: '5555555555',
			emergencyName: 'Sarah Johnson',
			emergencyPhone: '5555555556',
			medicalConditions: '',
			tshirtSize: 'XL',
			bibNumber: '',
			deviceType: '',
			deviceId: '',
			rfidTagId: '',
			category: '10K',
			status: 'pending-assignment',
			isAssigned: false,
		},
		{
			id: 4,
			firstName: 'Emily',
			lastName: 'Davis',
			email: 'emily.davis@email.com',
			phone: '4444444444',
			emergencyName: 'Tom Davis',
			emergencyPhone: '4444444445',
			medicalConditions: 'Allergic to latex',
			tshirtSize: 'S',
			bibNumber: '',
			deviceType: '',
			deviceId: '',
			rfidTagId: '',
			category: 'Full Marathon',
			status: 'pending-assignment',
			isAssigned: false,
		},
	]);

	const leaderboard = [
		{
			rank: 1,
			name: 'John Doe',
			bibNumber: '001',
			time: '2:15:30',
			lastCheckpoint: 'CP-5',
		},
		{
			rank: 2,
			name: 'Jane Smith',
			bibNumber: '002',
			time: '2:18:45',
			lastCheckpoint: 'CP-5',
		},
		{
			rank: 3,
			name: 'Mike Johnson',
			bibNumber: '003',
			time: '2:22:10',
			lastCheckpoint: 'CP-4',
		},
	];

	const runnerStatus = [
		{
			bibNumber: '001',
			name: 'John Doe',
			rfidStatus: 'Active',
			heartRate: 145,
			lastSeen: '2 min ago',
		},
		{
			bibNumber: '002',
			name: 'Jane Smith',
			rfidStatus: 'Active',
			heartRate: 152,
			lastSeen: '1 min ago',
		},
		{
			bibNumber: '003',
			name: 'Mike Johnson',
			rfidStatus: 'Active',
			heartRate: 138,
			lastSeen: '3 min ago',
		},
	];

	const addForm = useForm<ParticipantFormData>({
		resolver: zodResolver(participantSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			emergencyName: '',
			emergencyPhone: '',
			medicalConditions: '',
			tshirtSize: 'M',
			category: 'full-marathon',
			bibNumber: '',
			deviceType: 'rfid',
			deviceId: '',
			rfidTagId: '',
		},
	});

	const editForm = useForm<ParticipantFormData>({
		resolver: zodResolver(participantSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			emergencyName: '',
			emergencyPhone: '',
			medicalConditions: '',
			tshirtSize: 'M',
			category: 'full-marathon',
			bibNumber: '',
			deviceType: 'rfid',
			deviceId: '',
			rfidTagId: '',
		},
	});

	const assignForm = useForm<DeviceAssignmentFormData>({
		resolver: zodResolver(deviceAssignmentSchema),
		defaultValues: {
			bibNumber: '',
			deviceType: 'rfid',
			deviceId: '',
			rfidTagId: '',
		},
	});

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
				data.deviceType === 'running-node'
					? 'Running Node'
					: data.deviceType === 'rfid'
						? 'RFID'
						: 'Hybrid',
			deviceId: data.deviceId,
			rfidTagId: data.rfidTagId,
			category:
				data.category === 'full-marathon'
					? 'Full Marathon'
					: data.category === 'half-marathon'
						? 'Half Marathon'
						: '10K',
			status: 'registered',
			isAssigned: true,
		};

		setParticipants([...participants, newParticipant]);
		toast({
			title: 'Participant Registered',
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
						emergencyName: data.emergencyName,
						emergencyPhone: data.emergencyPhone,
						medicalConditions: data.medicalConditions,
						tshirtSize: data.tshirtSize,
						bibNumber: data.bibNumber,
						deviceType:
							data.deviceType === 'running-node'
								? 'Running Node'
								: data.deviceType === 'rfid'
									? 'RFID'
									: 'Hybrid',
						deviceId: data.deviceId,
						rfidTagId: data.rfidTagId,
						category:
							data.category === 'full-marathon'
								? 'Full Marathon'
								: data.category === 'half-marathon'
									? 'Half Marathon'
									: '10K',
					}
				: p,
		);

		setParticipants(updatedParticipants);
		toast({
			title: 'Participant Updated',
			description: `${data.firstName} ${data.lastName}'s information has been updated.`,
		});
		setIsEditDialogOpen(false);
		setSelectedParticipant(null);
	};

	const handleAssignDevice = (data: DeviceAssignmentFormData) => {
		if (!selectedParticipant) return;

		const updatedParticipants = participants.map((p) =>
			p.id === selectedParticipant.id
				? {
						...p,
						bibNumber: data.bibNumber,
						deviceType:
							data.deviceType === 'running-node'
								? 'Running Node'
								: data.deviceType === 'rfid'
									? 'RFID'
									: 'Hybrid',
						deviceId: data.deviceId,
						rfidTagId: data.rfidTagId,
						status: 'registered',
						isAssigned: true,
					}
				: p,
		);

		setParticipants(updatedParticipants);
		toast({
			title: 'Device Assigned',
			description: `${selectedParticipant.firstName} ${selectedParticipant.lastName} has been assigned bib #${data.bibNumber}.`,
		});
		setIsAssignDialogOpen(false);
		setSelectedParticipant(null);
		assignForm.reset();
	};

	const handleDeleteParticipant = (participant: Participant) => {
		setParticipants(participants.filter((p) => p.id !== participant.id));
		toast({
			title: 'Participant Removed',
			description: `${participant.firstName} ${participant.lastName} has been removed from the event.`,
			variant: 'destructive',
		});
	};

	const openEditDialog = (participant: Participant) => {
		setSelectedParticipant(participant);
		const deviceTypeValue = participant.deviceType
			.toLowerCase()
			.replace(' ', '-') as 'rfid' | 'running-node' | 'hybrid';
		const categoryValue = participant.category
			.toLowerCase()
			.replace(' ', '-') as 'full-marathon' | 'half-marathon' | '10k';
		const tshirtValue = participant.tshirtSize as
			| 'XS'
			| 'S'
			| 'M'
			| 'L'
			| 'XL'
			| 'XXL';

		editForm.reset({
			firstName: participant.firstName,
			lastName: participant.lastName,
			email: participant.email,
			phone: participant.phone,
			emergencyName: participant.emergencyName,
			emergencyPhone: participant.emergencyPhone,
			medicalConditions: participant.medicalConditions || '',
			tshirtSize: tshirtValue,
			bibNumber: participant.bibNumber,
			deviceType: deviceTypeValue || 'rfid',
			deviceId: participant.deviceId,
			rfidTagId: participant.rfidTagId,
			category: categoryValue,
		});
		setIsEditDialogOpen(true);
	};

	const openAssignDialog = (participant: Participant) => {
		setSelectedParticipant(participant);
		assignForm.reset({
			bibNumber: '',
			deviceType: 'rfid',
			deviceId: '',
			rfidTagId: '',
		});
		setIsAssignDialogOpen(true);
	};

	const filteredParticipants = participants.filter(
		(p) =>
			p.isAssigned &&
			(p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.bibNumber.includes(searchQuery) ||
				p.email.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	const pendingParticipants = participants.filter(
		(p) =>
			!p.isAssigned &&
			(p.firstName.toLowerCase().includes(pendingSearchQuery.toLowerCase()) ||
				p.lastName.toLowerCase().includes(pendingSearchQuery.toLowerCase()) ||
				p.email.toLowerCase().includes(pendingSearchQuery.toLowerCase())),
	);

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
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
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

	const DeviceAssignmentFields = ({
		form,
	}: {
		form: ReturnType<typeof useForm<DeviceAssignmentFormData>>;
	}) => (
		<div className='grid gap-4 py-4'>
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
	);

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold text-foreground mb-2'>
					{event.name}
				</h1>
				<div className='flex flex-wrap gap-4 text-muted-foreground'>
					<span className='flex items-center gap-1'>
						<MapPin className='w-4 h-4' />
						{event.location}
					</span>
					<span>{event.date}</span>
					<span className='text-primary font-medium'>{event.distance}</span>
				</div>
			</div>

			<Tabs defaultValue='participants' className='w-full'>
				<TabsList className='grid w-full grid-cols-5'>
					<TabsTrigger value='participants'>
						<Users className='w-4 h-4 mr-2' />
						Participants
					</TabsTrigger>
					<TabsTrigger value='pending'>
						<Tag className='w-4 h-4 mr-2' />
						Pending Assignments
						{pendingParticipants.length > 0 && (
							<Badge
								variant='destructive'
								className='ml-2 flex items-center justify-center h-5 w-5 rounded-full p-0 text-xs'
							>
								{participants.filter((p) => !p.isAssigned).length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value='map'>
						<MapPin className='w-4 h-4 mr-2' />
						Map Track
					</TabsTrigger>
					<TabsTrigger value='leaderboard'>
						<Trophy className='w-4 h-4 mr-2' />
						Leaderboard
					</TabsTrigger>
					<TabsTrigger value='status'>
						<Activity className='w-4 h-4 mr-2' />
						Runner Status
					</TabsTrigger>
				</TabsList>

				<TabsContent value='participants' className='space-y-4'>
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
									<Dialog
										open={isAddDialogOpen}
										onOpenChange={setIsAddDialogOpen}
									>
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
													Register a client for this event and assign their
													device, bib number, and RFID tag.
												</DialogDescription>
											</DialogHeader>
											<Form {...addForm}>
												<form
													onSubmit={addForm.handleSubmit(handleAddParticipant)}
												>
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
												<Badge variant='secondary'>
													{participant.category}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge variant='outline'>
													{participant.deviceType}
												</Badge>
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
												No participants found. Click "Register Participant" to
												add one.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Pending Assignments Tab */}
				<TabsContent value='pending' className='space-y-4'>
					<Card>
						<CardHeader>
							<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
								<div>
									<CardTitle>Pending Device Assignments</CardTitle>
									<p className='text-sm text-muted-foreground mt-1'>
										Self-registered clients awaiting device, bib number, and
										RFID tag assignment
									</p>
								</div>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
									<Input
										placeholder='Search pending...'
										className='pl-9 w-[250px]'
										value={pendingSearchQuery}
										onChange={(e) => setPendingSearchQuery(e.target.value)}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Phone</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>T-Shirt</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pendingParticipants.map((participant) => (
										<TableRow key={participant.id}>
											<TableCell className='font-medium'>
												{participant.firstName} {participant.lastName}
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{participant.email}
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{participant.phone}
											</TableCell>
											<TableCell>
												<Badge variant='secondary'>
													{participant.category}
												</Badge>
											</TableCell>
											<TableCell>{participant.tshirtSize}</TableCell>
											<TableCell>
												<Badge
													variant='outline'
													className='bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
												>
													Pending Assignment
												</Badge>
											</TableCell>
											<TableCell className='text-right'>
												<Button
													size='sm'
													onClick={() => openAssignDialog(participant)}
													className='gap-2'
												>
													<UserCheck className='w-4 h-4' />
													Assign Device
												</Button>
											</TableCell>
										</TableRow>
									))}
									{pendingParticipants.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												className='text-center py-8 text-muted-foreground'
											>
												No pending assignments. All registered participants have
												been assigned devices.
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

				{/* Assign Device Dialog */}
				<Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
					<DialogContent className='max-w-md'>
						<DialogHeader>
							<DialogTitle>Assign Device to Participant</DialogTitle>
							<DialogDescription>
								{selectedParticipant && (
									<>
										Assign bib number, device, and RFID tag to{' '}
										<strong>
											{selectedParticipant.firstName}{' '}
											{selectedParticipant.lastName}
										</strong>
									</>
								)}
							</DialogDescription>
						</DialogHeader>
						<Form {...assignForm}>
							<form onSubmit={assignForm.handleSubmit(handleAssignDevice)}>
								<DeviceAssignmentFields form={assignForm} />
								<div className='flex justify-end gap-2 mt-4'>
									<Button
										type='button'
										variant='outline'
										onClick={() => setIsAssignDialogOpen(false)}
									>
										Cancel
									</Button>
									<Button type='submit'>Assign Device</Button>
								</div>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				<TabsContent value='map' className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Race Route Map</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='w-full h-[500px] bg-muted rounded-lg flex items-center justify-center'>
								<div className='text-center text-muted-foreground'>
									<MapPin className='w-12 h-12 mx-auto mb-2' />
									<p>Map visualization will be displayed here</p>
									<p className='text-sm'>
										Integration with mapping service pending
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='leaderboard' className='space-y-4'>
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
												<div className='flex items-center gap-2'>
													{runner.rank === 1 && (
														<Trophy className='w-4 h-4 text-yellow-500' />
													)}
													<span className='font-bold'>{runner.rank}</span>
												</div>
											</TableCell>
											<TableCell className='font-medium'>
												{runner.bibNumber}
											</TableCell>
											<TableCell>{runner.name}</TableCell>
											<TableCell className='font-mono'>{runner.time}</TableCell>
											<TableCell>
												<Badge variant='secondary'>
													{runner.lastCheckpoint}
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='status' className='space-y-4'>
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
											<TableCell className='font-medium'>
												{runner.bibNumber}
											</TableCell>
											<TableCell>{runner.name}</TableCell>
											<TableCell>
												<Badge className='bg-teal-500/20 text-teal-700 dark:text-teal-300'>
													{runner.rfidStatus}
												</Badge>
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<Activity className='w-4 h-4 text-red-500' />
													<span className='font-mono'>{runner.heartRate}</span>
												</div>
											</TableCell>
											<TableCell className='text-muted-foreground'>
												{runner.lastSeen}
											</TableCell>
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
