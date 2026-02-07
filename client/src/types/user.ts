export type User = {
	_id: string;
	name: string;
	email: string;
	password: string;
	archived?: boolean;
	profilePicture?: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date | undefined;
	googleID: string;
	createdAt: Date;
	updatedAt: Date;
};
