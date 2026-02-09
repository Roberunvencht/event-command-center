import { BAD_REQUEST, CREATED, NOT_FOUND } from '../constant/http';
import appAssert from '../errors/app-assert';
import EventModel from '../models/event.model';
import RegistrationModel from '../models/registration.model';
import { registrationSchema } from '../schemas/registration.schema';
import CustomResponse from '../utils/response';
import { asyncHandler } from '../utils/utils';

export const registerController = asyncHandler(async (req, res) => {
	const { eventID } = req.params;
	appAssert(typeof eventID === 'string', BAD_REQUEST, 'Invalid event ID');

	const { raceCategoryId, shirtSize, emergencyContact, medicalInfo } =
		registrationSchema.parse(req.body);

	const event = await EventModel.findById(eventID);
	appAssert(event, NOT_FOUND, 'Event not found');

	const category = event.raceCategories.find(
		(cat) => cat._id.toString() === raceCategoryId,
	);
	appAssert(category, NOT_FOUND, 'Race category not found');

	appAssert(
		category.registeredCount < category.slots,
		BAD_REQUEST,
		'Category full',
	);

	// check if the user has already registered for this event
	const existingRegistration = await RegistrationModel.findOne({
		userId: req.user._id,
		eventId: eventID,
	});
	appAssert(
		!existingRegistration,
		BAD_REQUEST,
		'You have already registered for this event',
	);

	const registration = await RegistrationModel.create({
		userId: req.user._id,
		eventId: eventID,
		raceCategoryId,
		shirtSize,
		emergencyContact,
		medicalInfo: Object.fromEntries(
			Object.entries(medicalInfo).filter(([_, v]) => v !== undefined),
		),
	});

	category.registeredCount++;
	await event.save();

	res
		.status(CREATED)
		.json(new CustomResponse(true, registration, 'Registration successful'));
});
