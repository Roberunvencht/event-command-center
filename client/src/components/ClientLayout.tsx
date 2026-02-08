import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from './ClientSidebar';
import { Outlet } from 'react-router-dom';

export const ClientLayout = () => {
	return (
		<div className='flex min-h-screen w-full'>
			<ClientSidebar />
			<div className='flex-1 flex flex-col'>
				<header className='h-14 border-b border-border bg-card flex items-center px-4 sticky top-0 z-10'>
					<SidebarTrigger className='mr-4' />
					<div className='flex-1' />
				</header>
				<main className='flex-1 p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};
