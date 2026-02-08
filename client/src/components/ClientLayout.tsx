import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from './ClientSidebar';
import ProtectedRoute from './ProtectedRoute';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ProtectedRoute>
			<SidebarProvider>
				<div className='flex min-h-screen w-full'>
					<ClientSidebar />
					<main className='flex-1 overflow-auto'>
						<div className='container mx-auto p-6'>
							<div className='mb-4'>
								<SidebarTrigger />
							</div>
							{children}
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ProtectedRoute>
	);
};
