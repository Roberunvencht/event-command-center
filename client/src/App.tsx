import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ClientLayout } from './components/ClientLayout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Participants from './pages/Participants';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ClientHome from './pages/client/Home';
import ClientEventList from './pages/client/EventList';
import ClientEventDetail from './pages/client/EventDetail';
import RaceParticipation from './pages/client/RaceParticipation';
import Leaderboard from './pages/client/Leaderboard';
import Profile from './pages/client/Profile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Logout from './pages/auth/Logout';

export const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						{/* Auth Routes */}
						<Route path='/login' element={<Login />} />
						<Route path='/signup' element={<Signup />} />
						<Route path='/logout' element={<Logout />} />

						{/* Admin Routes */}
						<Route
							path='/'
							element={
								<Layout>
									<Dashboard />
								</Layout>
							}
						/>
						<Route
							path='/events'
							element={
								<Layout>
									<Events />
								</Layout>
							}
						/>
						<Route
							path='/events/:id'
							element={
								<Layout>
									<EventDetail />
								</Layout>
							}
						/>
						<Route
							path='/participants'
							element={
								<Layout>
									<Participants />
								</Layout>
							}
						/>
						<Route
							path='/reports'
							element={
								<Layout>
									<Reports />
								</Layout>
							}
						/>
						<Route
							path='/settings'
							element={
								<Layout>
									<Settings />
								</Layout>
							}
						/>

						{/* Client Routes */}
						<Route
							path='/client'
							element={
								<ClientLayout>
									<ClientHome />
								</ClientLayout>
							}
						/>
						<Route
							path='/client/events'
							element={
								<ClientLayout>
									<ClientEventList />
								</ClientLayout>
							}
						/>
						<Route
							path='/client/events/:id'
							element={
								<ClientLayout>
									<ClientEventDetail />
								</ClientLayout>
							}
						/>
						<Route
							path='/client/race'
							element={
								<ClientLayout>
									<RaceParticipation />
								</ClientLayout>
							}
						/>
						<Route
							path='/client/leaderboard'
							element={
								<ClientLayout>
									<Leaderboard />
								</ClientLayout>
							}
						/>
						<Route
							path='/client/profile'
							element={
								<ClientLayout>
									<Profile />
								</ClientLayout>
							}
						/>

						<Route path='*' element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
};

export default App;
