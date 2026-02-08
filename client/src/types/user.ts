export type Role = 'admin' | 'user';

export type User = {
	_id: string;
	name: string;
	email: string;
	role: Role;
	password: string;
	archived?: boolean;
	profilePicture?: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date | undefined;
	googleID: string;
	createdAt: Date;
	updatedAt: Date;
};
