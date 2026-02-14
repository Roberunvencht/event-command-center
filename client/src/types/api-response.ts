export type CustomResponse<T> = {
	success: boolean;
	data: T;
	message: string;
	error?: string;
};
