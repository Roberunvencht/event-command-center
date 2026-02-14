import { createRoot } from 'react-dom/client';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import Route from './Route.tsx';
import { Toaster } from '@/components/ui/toaster';

export const queryClient = new QueryClient();
const rootElement = document.getElementById('root') as HTMLElement;

let root = (rootElement as any)._reactRoot ?? createRoot(rootElement);
(rootElement as any)._reactRoot = root;

root.render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<Route />
				<Toaster />
			</SidebarProvider>
		</QueryClientProvider>
	</StrictMode>,
);
