import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Radio, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useUserStore } from '@/stores/user';
import { format } from 'date-fns';

export default function EditProfile() {
	const { user } = useUserStore((state) => state);

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<User className='w-5 h-5 text-primary' />
					Personal Information
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Full Name</Label>
					<Input id='name' defaultValue={user.name} />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='email'>Email Address</Label>
					<Input id='email' type='email' defaultValue={user.email} />
				</div>
				<div className='space-y-2'>
					<Label htmlFor='phone'>Phone Number</Label>
					<Input id='phone' type='tel' defaultValue={user.phone} />
				</div>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<Calendar className='w-4 h-4' />
					<span>
						Member since {format(new Date(user.createdAt), 'MMM d, yyyy')}
					</span>
				</div>
				<Button className='w-full'>Update Profile</Button>
			</CardContent>
		</Card>
	);
}
