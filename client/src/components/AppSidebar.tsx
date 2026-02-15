import {
	Home,
	Users,
	Trophy,
	Calendar,
	Settings,
	HardDrive,
	Activity,
	FileText,
	History,
	MessageSquare,
	Power,
	Computer,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
	{ title: 'Dashboard', url: '/', icon: Home },
	{ title: 'Events', url: '/events', icon: Calendar },
	{ title: 'Participants', url: '/participants', icon: Users },
	{ title: 'Devices', url: '/devices', icon: Computer },
	{ title: 'Reports', url: '/reports', icon: FileText },
	{ title: 'Settings', url: '/settings', icon: Settings },
	{ title: 'Logout', url: '/logout', icon: Power },
];

export function AppSidebar() {
	return (
		<Sidebar className='border-r border-sidebar-border'>
			<SidebarHeader className='p-4 border-b border-sidebar-border'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
						<span className='text-primary-foreground font-bold text-lg'>L</span>
					</div>
					<div>
						<h2 className='font-bold text-sidebar-foreground'>LapSync</h2>
						<p className='text-xs text-sidebar-foreground/60'>
							Event Management
						</p>
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
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<NavLink
											to={item.url}
											end={item.url === '/'}
											className='hover:bg-sidebar-accent transition-colors'
											activeClassName='bg-sidebar-accent text-primary font-medium'
										>
											<item.icon className='w-4 h-4' />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
