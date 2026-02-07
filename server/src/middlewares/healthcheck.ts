import { Request, Response } from 'express';
import { OK } from '../constant/http';

export const healthcheck = async (req: Request, res: Response) => {
	res.status(OK).json({
		message: 'App is working',
	});
};
