import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../config";

export const sendError = (res: Response, statusCode: number, message: string, errors?: unknown):Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};


export const globalErrorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {

if(config.node_env === 'development'){
return sendError(res,
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err.message || "Internal Server Error",
    {name:err.name,stack: err.stack})
}else{
    if (err.isOperational) {
        const safeMessage = err.message || "Internal Server Error";
        return sendError(res,
        err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        safeMessage,
        safeMessage 
        );
    } 
    else {
        const secureFallback = "Something went very wrong!";
        return sendError(res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        secureFallback,
        secureFallback 
        );
    }
}
};

export const notFound = (req: Request, res: Response) => {

return sendError(res,StatusCodes.NOT_FOUND,'API Not Found',{path: req.originalUrl,method: req.method})
};