import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Timer, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { signupSchema } from '@/schemas/auth.schema';
import axiosInstance from '@/api/axios';

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
	const { token } = useParams();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const form = useForm<ResetPasswordFormSchema>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const password = form.watch('password');
	const passwordRequirements = [
		{ label: 'At least 8 characters', met: password.length >= 8 },
		{ label: 'One uppercase letter', met: /[A-Z]/.test(password) },
		{ label: 'One number', met: /[0-9]/.test(password) },
	];

	const onSubmit = async (formData: ResetPasswordFormSchema) => {
		console.log(formData);
		console.log(token);
		try {
			setIsLoading(true);
			const { data } = await axiosInstance.post(
				`/auth/reset-password/${token}`,
				formData,
			);

			toast({
				title: 'Success',
				description: data.message ?? 'Password reset successfully.',
			});
			navigate('/login');
		} catch (error) {
			console.error('Failed reset password', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description:
					error.message ?? 'An error occurred while resetting your password.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-background flex w-full'>
			{/* Left side - Branding */}
			<div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sidebar via-sidebar to-primary/20 relative overflow-hidden'>
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

				<div className='relative z-10 flex flex-col justify-center px-12 text-sidebar-foreground'>
					<div className='flex items-center gap-4 mb-8'>
						<div className='w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg'>
							<Timer className='w-8 h-8 text-primary-foreground' />
						</div>
						<div>
							<h1 className='text-4xl font-bold'>LapSync</h1>
							<p className='text-sidebar-foreground/70'>
								Race Event Management
							</p>
						</div>
					</div>

					<div className='space-y-6 max-w-md'>
						<h2 className='text-3xl font-semibold leading-tight'>
							Join the Race.
							<br />
							Track Your Journey.
						</h2>
						<p className='text-sidebar-foreground/80 text-lg'>
							Create your account to register for events, track your
							performance, and compete on leaderboards.
						</p>

						<div className='space-y-4 pt-6'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
									<Check className='w-5 h-5 text-primary' />
								</div>
								<span>Register for upcoming events</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
									<Check className='w-5 h-5 text-primary' />
								</div>
								<span>Track your race history and times</span>
							</div>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
									<Check className='w-5 h-5 text-primary' />
								</div>
								<span>Compete on global leaderboards</span>
							</div>
						</div>
					</div>
				</div>

				{/* Decorative elements */}
				<div className='absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl' />
				<div className='absolute top-20 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl' />
			</div>

			{/* Right side - Signup Form */}
			<div className='flex-1 flex items-center justify-center p-8 overflow-auto'>
				<div className='w-full max-w-md'>
					{/* Mobile logo */}
					<div className='lg:hidden flex items-center gap-3 mb-8 justify-center'>
						<div className='w-12 h-12 bg-primary rounded-xl flex items-center justify-center'>
							<Timer className='w-6 h-6 text-primary-foreground' />
						</div>
						<div>
							<h1 className='text-2xl font-bold text-foreground'>LapSync</h1>
							<p className='text-xs text-muted-foreground'>
								Race Event Management
							</p>
						</div>
					</div>

					<Card className='border-0 shadow-xl'>
						<CardHeader className='space-y-1 pb-4'>
							<CardTitle className='text-2xl font-bold'>
								Reset password
							</CardTitle>
							<CardDescription>Enter your new password</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className='space-y-4'
								>
									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<div className='relative'>
														<Input
															placeholder='New password'
															type={showPassword ? 'text' : 'password'}
															autoComplete='new-password'
															{...field}
														/>
														<Button
															type='button'
															variant='ghost'
															size='icon'
															className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
															onClick={() => setShowPassword(!showPassword)}
														>
															{showPassword ? (
																<EyeOff className='h-4 w-4 text-muted-foreground' />
															) : (
																<Eye className='h-4 w-4 text-muted-foreground' />
															)}
														</Button>
													</div>
												</FormControl>
												{password && (
													<div className='space-y-1 mt-2'>
														{passwordRequirements.map((req, index) => (
															<div
																key={index}
																className={`flex items-center gap-2 text-xs ${
																	req.met
																		? 'text-success'
																		: 'text-muted-foreground'
																}`}
															>
																<Check
																	className={`w-3 h-3 ${req.met ? 'opacity-100' : 'opacity-30'}`}
																/>
																{req.label}
															</div>
														))}
													</div>
												)}
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='confirmPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm password</FormLabel>
												<FormControl>
													<div className='relative'>
														<Input
															placeholder='Confirm your password'
															type={showConfirmPassword ? 'text' : 'password'}
															autoComplete='new-password'
															{...field}
														/>
														<Button
															type='button'
															variant='ghost'
															size='icon'
															className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
															onClick={() =>
																setShowConfirmPassword(!showConfirmPassword)
															}
														>
															{showConfirmPassword ? (
																<EyeOff className='h-4 w-4 text-muted-foreground' />
															) : (
																<Eye className='h-4 w-4 text-muted-foreground' />
															)}
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type='submit'
										className='w-full'
										size='lg'
										disabled={isLoading}
									>
										{isLoading ? (
											'Changing password...'
										) : (
											<>
												Change Password
												<ArrowRight className='w-4 h-4 ml-2' />
											</>
										)}
									</Button>
								</form>
							</Form>

							<div className='mt-6 text-center text-sm'>
								<span className='text-muted-foreground'>
									Already have an account?{' '}
								</span>
								<Link
									to='/login'
									className='text-primary font-medium hover:underline'
								>
									Sign in
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
