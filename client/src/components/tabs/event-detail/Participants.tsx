import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Participant } from '@/types/participant';
import { Event } from '@/types/event';
import ConfirmDialog from '@/components/ConfirmDialog';

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
	const [searchQuery, setSearchQuery] = useState('');
	const { toast } = useToast();

	const handleDeleteParticipant = (participant: Participant) => {
		setParticipants(participants.filter((p) => p.id !== participant.id));
		toast({
			title: 'Participant Removed',
			description: `${participant.firstName} ${participant.lastName} has been removed from the event.`,
			variant: 'destructive',
		});
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
						{/* <RegisterEventDialog event={event} /> */}
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
										<ConfirmDialog
											onConfirm={() => handleDeleteParticipant(participant)}
											icon={<Trash2 className='w-4 h-4' />}
											trigger={
												<Button
													variant='ghost'
													size='sm'
													className='text-destructive hover:text-destructive'
												>
													<Trash2 className='w-4 h-4' />
												</Button>
											}
										/>
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
			</CardContent>
		</Card>
	);
}
