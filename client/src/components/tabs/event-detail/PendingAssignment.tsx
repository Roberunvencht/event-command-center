import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import z from 'zod';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Participant } from '@/types/participant';
import { zodResolver } from '@hookform/resolvers/zod';

type PendingAssignmentProps = {
	participants: Participant[];
	setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
	selectedParticipant: Participant | null;
	setSelectedParticipant: React.Dispatch<
		React.SetStateAction<Participant | null>
	>;
};

export default function PendingAssignment({
	participants,
	setParticipants,
	selectedParticipant,
	setSelectedParticipant,
}: PendingAssignmentProps) {
	const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
	const { toast } = useToast();
	const [pendingSearchQuery, setPendingSearchQuery] = useState('');

	const assignForm = useForm<DeviceAssignmentFormData>({
		resolver: zodResolver(deviceAssignmentSchema),
		defaultValues: {
			bibNumber: '',
			deviceType: 'rfid',
			deviceId: '',
			rfidTagId: '',
		},
	});

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

	const pendingParticipants = participants.filter(
		(p) =>
			!p.isAssigned &&
			(p.firstName.toLowerCase().includes(pendingSearchQuery.toLowerCase()) ||
				p.lastName.toLowerCase().includes(pendingSearchQuery.toLowerCase()) ||
				p.email.toLowerCase().includes(pendingSearchQuery.toLowerCase())),
	);

	return (
		<Card>
			<CardHeader>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
					<div>
						<CardTitle>Pending Device Assignments</CardTitle>
						<p className='text-sm text-muted-foreground mt-1'>
							Self-registered clients awaiting device, bib number, and RFID tag
							assignment
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
									<Badge variant='secondary'>{participant.category}</Badge>
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
									No pending assignments. All registered participants have been
									assigned devices.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

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
			</CardContent>
		</Card>
	);
}

// Schema for device assignment only
const deviceAssignmentSchema = z.object({
	bibNumber: z.string().min(1, 'Bib number is required').max(10),
	deviceType: z.enum(['rfid', 'running-node', 'hybrid']),
	deviceId: z.string().min(1, 'Device ID is required').max(50),
	rfidTagId: z.string().min(1, 'RFID Tag ID is required').max(50),
});

type DeviceAssignmentFormData = z.infer<typeof deviceAssignmentSchema>;

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
