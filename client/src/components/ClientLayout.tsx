import { ClientSidebar } from './ClientSidebar';
import { Outlet } from 'react-router-dom';
import { Topbar } from './Topbar';

export const ClientLayout = () => {
	return (
		<div className='flex min-h-screen w-full'>
			<ClientSidebar />
			<div className='flex-1 flex flex-col'>
				<Topbar />
				<main className='flex-1 p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};
