import axiosInstance from '@/api/axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await axiosInstance.get('/auth/logout');
				navigate('/login');
			} catch (err: any) {
				console.error('Failed to logout');
			}
		})();
	}, []);

	return (
		<div>
			<p>Logging out...</p>
		</div>
	);
}
