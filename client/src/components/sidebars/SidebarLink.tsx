import { MenuItem } from '../AppSidebar';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { NavLink } from '@/components/NavLink';

export default function SidebarLink({ item }: { item: MenuItem }) {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				{item.asButton ? (
					<button className='hover:bg-sidebar-accent transition-colors'>
						<item.icon className='w-4 h-4' />
						<span>{item.title}</span>
					</button>
				) : (
					<NavLink
						to={item.url}
						end={item.url === '/client' || item.url === '/'}
						className={`hover:bg-sidebar-accent transition-colors`}
						activeClassName='bg-sidebar-accent text-primary font-medium'
					>
						<item.icon className='w-4 h-4' />
						<span>{item.title}</span>
					</NavLink>
				)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
