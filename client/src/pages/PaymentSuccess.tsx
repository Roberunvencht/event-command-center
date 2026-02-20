import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { CustomResponse } from '@/types/api-response';
import { CheckCircle, Loader2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'success' | 'pending' | 'error';

export default function PaymentSuccess() {
	const [status, setStatus] = useState<Status>('loading');
	const [message, setMessage] = useState('Verifying your payment...');
	const location = useLocation();
	const navigate = useNavigate();

	const query = new URLSearchParams(location.search);
	const registrationId = query.get('registrationId');

	useEffect(() => {
		if (!registrationId) {
			setStatus('error');
			setMessage('Registration ID is missing.');
			return;
		}

		const verifyPayment = async () => {
			try {
				const { data } = await axiosInstance.post<CustomResponse<any>>(
					'/payment/verify',
					{ registrationId },
				);

				if (data.data === true) {
					setStatus('success');
					setMessage('Payment successful! Your registration is confirmed.');
					// setTimeout(() => navigate('/client/events'), 3000);
				} else if (typeof data.data === 'string') {
					setStatus('pending');
					setMessage('Payment still pending. Redirecting to checkout...');
					setTimeout(() => {
						window.location.href = data.data;
					}, 1500);
				} else {
					setStatus('error');
					setMessage('Unable to verify payment.');
				}
			} catch (err) {
				console.error(err);
				setStatus('error');
				setMessage('Something went wrong while verifying payment.');
			}
		};

		verifyPayment();
	}, [registrationId, navigate]);

	const renderIcon = () => {
		switch (status) {
			case 'loading':
				return <Loader2 className='w-12 h-12 animate-spin text-primary' />;
			case 'success':
				return <CheckCircle className='w-12 h-12 text-green-500' />;
			case 'pending':
				return <Clock className='w-12 h-12 text-yellow-500' />;
			case 'error':
				return <XCircle className='w-12 h-12 text-red-500' />;
		}
	};

	return (
		<div className='flex justify-center px-4'>
			<div className='w-full max-w-md p-8 text-center space-y-6'>
				<div className='flex justify-center'>{renderIcon()}</div>

				<h1 className='text-2xl font-semibold'>
					{status === 'loading' && 'Verifying Payment'}
					{status === 'success' && 'Payment Successful'}
					{status === 'pending' && 'Payment Pending'}
					{status === 'error' && 'Verification Failed'}
				</h1>

				<p className='text-muted-foreground text-sm'>{message}</p>

				{status === 'success' && (
					<Button className='w-full' onClick={() => navigate('/client/events')}>
						Go to My Events
					</Button>
				)}

				{status === 'error' && (
					<Button
						variant='outline'
						className='w-full'
						onClick={() => navigate('/client/events')}
					>
						Back to Events
					</Button>
				)}
			</div>
		</div>
	);
}
