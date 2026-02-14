import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
import ProtectedRoute from './components/ProtectedRoute';
import PaymentSuccess from './pages/PaymentSuccess';

const router = createBrowserRouter([
	/* ------------------ Auth Routes ------------------ */
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/signup',
		element: <Signup />,
	},
	{
		path: '/logout',
		element: <Logout />,
	},

	/* ------------------ Admin Routes ------------------ */
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{
				path: 'events',
				element: <Events />,
			},
			{
				path: 'events/:eventID',
				element: <EventDetail />,
			},
			{
				path: 'participants',
				element: <Participants />,
			},
			{
				path: 'reports',
				element: <Reports />,
			},
			{
				path: 'settings',
				element: <Settings />,
			},
		],
	},

	/* ------------------ Client Routes ------------------ */
	{
		path: '/client',
		element: (
			<ProtectedRoute>
				<ClientLayout />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <ClientHome />,
			},
			{
				path: 'events',
				element: <ClientEventList />,
			},
			{
				path: 'events/:id',
				element: <ClientEventDetail />,
			},
			{
				path: 'race/:registrationId',
				element: <RaceParticipation />,
			},
			{
				path: 'race',
				element: <RaceParticipation />,
			},
			{
				path: 'leaderboard',
				element: <Leaderboard />,
			},
			{
				path: 'profile',
				element: <Profile />,
			},
			{
				path: 'payment/success',
				element: <PaymentSuccess />,
			},
		],
	},

	/* ------------------ 404 ------------------ */
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default function Route() {
	return <RouterProvider router={router} />;
}
