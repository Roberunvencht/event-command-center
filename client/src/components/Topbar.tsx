import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/user';
import { User } from 'lucide-react';

export function Topbar() {
	const { user } = useUserStore((state) => state);

	return (
		<header className='h-14 border-b border-border bg-card flex items-center px-4 sticky top-0 z-10'>
			<SidebarTrigger className='mr-4' />
			<div className='flex-1' />
			{user && (
				<div>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<User className='w-4 h-4' />
						<span>{user.name}</span>
					</div>
				</div>
			)}
		</header>
	);
}
