import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
} from '../ui/form';
import axiosInstance from '@/api/axios';
import { Plus } from 'lucide-react';
import { queryClient } from '@/main';
import { QUERY_KEYS } from '@/constants';

const deviceSchema = z.object({
	name: z.string().min(3, 'Device name must be at least 3 characters'),
	isActive: z.boolean(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

export default function AddDeviceDialog() {
	const { toast } = useToast();

	const form = useForm<DeviceFormValues>({
		resolver: zodResolver(deviceSchema),
		defaultValues: {
			name: '',
			isActive: true,
		},
	});

	const onSubmit = async (values: DeviceFormValues) => {
		try {
			await axiosInstance.post('/device', values);

			toast({
				title: 'Device created',
				description: 'Device has been successfully registered.',
			});

			form.reset();
			await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
		} catch (error: any) {
			toast({
				variant: 'destructive',
				title: 'Failed to create device',
				description:
					error?.response?.data?.message ||
					'Something went wrong while creating device.',
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Plus /> Add Device
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>Add New Device</DialogTitle>
					<DialogDescription>
						Register a new running node device into the system.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{/* Device Name */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Device Name</FormLabel>
									<FormControl>
										<Input placeholder='Running Node #001' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Active Switch */}
						<FormField
							control={form.control}
							name='isActive'
							render={({ field }) => (
								<FormItem className='flex items-center justify-between rounded-lg border p-4'>
									<div>
										<FormLabel>Active</FormLabel>
										<p className='text-sm text-muted-foreground'>
											Inactive devices cannot connect.
										</p>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type='submit' className='w-full'>
								Create Device
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
