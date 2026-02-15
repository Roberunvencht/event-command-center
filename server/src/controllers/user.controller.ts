import { OK, UNAUTHORIZED } from '../constant/http';
import { updateUserSchema } from '../schemas/user.schema';
import CustomResponse from '../utils/response';
import { asyncHandler } from '../utils/utils';

/**
 * @route PATCH /api/v1/auth/me - Update current user's profile
 */
export const updateProfileHandler = asyncHandler(async (req, res) => {
	const user = req.user;
	const body = updateUserSchema.parse(req.body);

	user.name = body.name;
	user.email = body.email;
	if (body.phone !== undefined) {
		const num = Number(body.phone);
		user.phone = isNaN(num) ? body.phone : num;
	}

	await user.save();

	res
		.status(OK)
		.json(new CustomResponse(true, user.omitPassword(), 'Profile updated'));
});
