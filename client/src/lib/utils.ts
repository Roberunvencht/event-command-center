import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDatesForInput = (object: any): any => {
	if (Array.isArray(object)) {
		return object.map((item) => formatDatesForInput(item));
	}

	if (object !== null && typeof object === 'object') {
		const updatedObject: any = {};

		for (const [key, value] of Object.entries(object)) {
			updatedObject[key] = formatDatesForInput(value);
		}

		return updatedObject;
	}

	if (typeof object === 'string') {
		return detectAndFormat(object);
	}

	return object;
};

function detectAndFormat(value: string) {
	// ISO DateTime (with T and Z)
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
		return formatDateForInput(value);
	}

	// Date only ISO (yyyy-mm-dd)
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}

	// 12-hour time (e.g. 04:00 AM)
	if (/^\d{1,2}:\d{2} (AM|PM)$/.test(value)) {
		return convertTo24Hour(value);
	}

	return value;
}

function convertTo24Hour(time: string) {
	const [timePart, modifier] = time.split(' ');
	let [hours, minutes] = timePart.split(':');

	if (modifier === 'PM' && hours !== '12') {
		hours = String(parseInt(hours) + 12);
	}

	if (modifier === 'AM' && hours === '12') {
		hours = '00';
	}

	return `${hours.padStart(2, '0')}:${minutes}`;
}

function formatDateTimeLocal(dateString: string) {
	const date = new Date(dateString);
	const pad = (n: number) => String(n).padStart(2, '0');

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateForInput(dateString: string) {
	return dateString.split('T')[0];
}
