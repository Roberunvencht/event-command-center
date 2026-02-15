import { Home, Calendar, Trophy, Activity, User, Power } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarHeader,
} from '@/components/ui/sidebar';
import { MenuItem } from './AppSidebar';
import SidebarLink from './sidebars/SidebarLink';
import LogoutButton from './buttons/LogoutButton';

const menuItems: MenuItem[] = [
	{ title: 'Home', url: '/client', icon: Home },
	{ title: 'Events', url: '/client/events', icon: Calendar },
	{ title: 'Leaderboard', url: '/client/leaderboard', icon: Trophy },
	{ title: 'Live Race', url: '/client/race', icon: Activity },
	{ title: 'Profile', url: '/client/profile', icon: User },
];

export function ClientSidebar() {
	return (
		<Sidebar className='border-r border-sidebar-border animate-appear'>
			<SidebarHeader className='p-4 border-b border-sidebar-border'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
						<span className='text-primary-foreground font-bold text-lg'>L</span>
					</div>
					<div>
						<h2 className='font-bold text-sidebar-foreground'>LapSync</h2>
						<p className='text-xs text-sidebar-foreground/60'>Runner Portal</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className='text-sidebar-foreground/60'>
						Navigation
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<>
								{menuItems.map((item) => (
									<SidebarLink key={item.title} item={item} />
								))}
								<LogoutButton />
							</>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
