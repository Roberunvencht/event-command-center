import { AppErrorCodes } from '../constant';
import { HttpStatusCode } from '../constant/http';

class AppError extends Error {
	constructor(
		public statusCode: HttpStatusCode,
		public message: string,
		public errorCode?: AppErrorCodes,
	) {
		super(message);
	}
}

export default AppError;
