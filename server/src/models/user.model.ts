import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
	name: string;
	email: string;
	password: string;
	profilePicture?: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date | undefined;
	googleID: string;
	archived: boolean;
	createdAt: Date;
	updatedAt: Date;
	omitPassword: () => Omit<IUser, 'password'>;
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, minlength: 1, required: true },
		email: { type: String, required: false },
		password: { type: String, required: true },
		profilePicture: { type: String, required: false },
		resetPasswordToken: { type: String, required: false },
		resetPasswordExpires: { type: Date, required: false },
		googleID: { type: String },
		archived: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	},
);

UserSchema.methods.omitPassword = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

UserSchema.pre('save', async function (next) {
	this.name = this.name.toLowerCase();
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
