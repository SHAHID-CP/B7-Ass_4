import type { Response } from "express";


type TMeta = {
    page: number;
    limit: number;
    total: number;
}


export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?:T, meta?:TMeta):Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
};
