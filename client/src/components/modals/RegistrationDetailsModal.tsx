import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Registration } from '@/types/registration';
import { format } from 'date-fns';
import { Label } from '../ui/label';

interface RegistrationDetailsModalProps {
	registration: Registration;
	open: boolean;
	setOpen: (open: boolean) => void;
}

export default function RegistrationDetailsModal({
	registration,
	open,
	setOpen,
}: RegistrationDetailsModalProps) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-h-[90vh] overflow-y-auto max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Participant Registration Details</DialogTitle>
					<DialogDescription>
						Full registration information for {registration.user.name}
					</DialogDescription>
				</DialogHeader>

				<Separator />

				<div className='space-y-6'>
					{/* User Information */}
					<div>
						<div className='pb-3'>
							<Label className='text-Base'>User Information</Label>
						</div>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Name
									</label>
									<p className='text-sm font-medium'>
										{registration.user.name}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Email
									</label>
									<p className='text-sm font-medium'>
										{registration.user.email}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Phone
									</label>
									<p className='text-sm font-medium'>
										{registration.user.phone || 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Member Since
									</label>
									<p className='text-sm font-medium'>
										{format(
											new Date(registration.user.createdAt),
											'MMM dd, yyyy',
										)}
									</p>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Registration Information */}
					<div>
						<div className='pb-3'>
							<Label className='text-base'>Registration Info</Label>
						</div>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Bib Number
									</label>
									<p className='text-sm font-medium'>
										{registration.bibNumber || 'Not Assigned'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Status
									</label>
									<p className='text-sm font-medium capitalize'>
										{registration.status}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Shirt Size
									</label>
									<p className='text-sm font-medium'>
										{registration.shirtSize}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Registered At
									</label>
									<p className='text-sm font-medium'>
										{format(
											new Date(registration.registeredAt),
											'MMM dd, yyyy HH:mm',
										)}
									</p>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Race Category Information */}
					<div>
						<div className='pb-3'>
							<Label className='text-base'>Race Category</Label>
						</div>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Category Name
									</label>
									<p className='text-sm font-medium'>
										{registration.raceCategory?.name || 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Distance
									</label>
									<p className='text-sm font-medium'>
										{registration.raceCategory?.distanceKm
											? `${registration.raceCategory.distanceKm}km`
											: 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Price
									</label>
									<p className='text-sm font-medium'>
										₱{registration.raceCategory?.price || 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Cutoff Time
									</label>
									<p className='text-sm font-medium'>
										{registration.raceCategory?.cutoffTime
											? `${registration.raceCategory.cutoffTime} min`
											: 'N/A'}
									</p>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Emergency Contact */}
					<div>
						<div className='pb-3'>
							<Label className='text-base'>Emergency Contact</Label>
						</div>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='col-span-2'>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Name
									</label>
									<p className='text-sm font-medium'>
										{registration.emergencyContact?.name || 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Phone
									</label>
									<p className='text-sm font-medium'>
										{registration.emergencyContact?.phone || 'N/A'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Relationship
									</label>
									<p className='text-sm font-medium'>
										{registration.emergencyContact?.relationship || 'N/A'}
									</p>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Medical Information */}
					<div>
						<div className='pb-3'>
							<Label className='text-base'>Medical Information</Label>
						</div>
						<div className='space-y-4'>
							<div className='space-y-3'>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Medical Conditions
									</label>
									<p className='text-sm font-medium'>
										{registration.medicalInfo?.conditions || 'None'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Allergies
									</label>
									<p className='text-sm font-medium'>
										{registration.medicalInfo?.allergies || 'None'}
									</p>
								</div>
								<div>
									<label className='text-xs font-semibold text-muted-foreground uppercase'>
										Medications
									</label>
									<p className='text-sm font-medium'>
										{registration.medicalInfo?.medications || 'None'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
