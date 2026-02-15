import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { CustomResponse } from '@/types/api-response';

export default function PaymentSuccess() {
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('Verifying payment...');
	const location = useLocation();
	const navigate = useNavigate();

	// Expect ?registrationId=xxx in query string
	const query = new URLSearchParams(location.search);
	const registrationId = query.get('registrationId');

	useEffect(() => {
		if (!registrationId) {
			setMessage('Registration ID missing.');
			return;
		}

		const verifyPayment = async () => {
			try {
				const { data } = await axiosInstance.post<CustomResponse<any>>(
					'/payment/verify',
					{ registrationId },
				);

				console.log({ data });

				if (data.data === true) {
					setMessage('Payment successful! 🎉');
					setTimeout(() => navigate('/client/events'), 2000);
				} else if (typeof data.data === 'string') {
					// active checkout URL returned
					setMessage('Payment pending, redirecting...');
					window.location.href = data.data;
				}
			} catch (err) {
				console.error(err);
				setMessage('Something went wrong while verifying payment.');
			} finally {
				setLoading(false);
			}
		};

		verifyPayment();
	}, [registrationId, navigate]);

	return (
		<div className='flex flex-col items-center justify-center pt-40'>
			<h1 className='text-2xl font-bold'>
				{loading ? 'Verifying...' : message}
			</h1>
		</div>
	);
}
