import { Power } from 'lucide-react';
import SidebarLink from '../sidebars/SidebarLink';
import axiosInstance from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog';

export default function LogoutButton() {
	const navigate = useNavigate();

	const logout = async () => {
		try {
			await axiosInstance.get('/auth/logout');
			navigate('/login');
		} catch (err: any) {
			console.error('Failed to logout');
		}
	};

	return (
		<ConfirmDialog
			onConfirm={logout}
			icon={<Power className='w-5 h-5' />}
			title='Logout'
			description='Are you sure you want to logout?'
			confirmText='Logout'
			trigger={
				<SidebarLink
					item={{
						title: 'Logout',
						url: '/logout',
						icon: Power,
						asButton: true,
					}}
				/>
			}
		/>
	);
}
