
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import type { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../utils/jwt";
import { AppError } from "../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: "TENANT" | "LANDLORD" | "ADMIN";
            }
        }
    }
}


export const auth = (...requiredRoles : Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken 
            :
            req.headers.authorization?.startsWith("Bearer ") ? 
            req.headers.authorization?.split(" ")[1] 
            : req.headers.authorization;

        if(!token) return next(new AppError(StatusCodes.UNAUTHORIZED, 'No token provided'));
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) return next(new AppError(StatusCodes.UNAUTHORIZED, verifiedToken.error));
        const { email, name, id, role } = verifiedToken.data as JwtPayload;



        if(requiredRoles.length && !requiredRoles.includes(role)) return next(new AppError(StatusCodes.UNAUTHORIZED, "Forbidden. You don't have permission to access this resource."));
        const user = await prisma.user.findUnique({
            where: {id,email, name, role
            }
        });


        if(!user) return next(new AppError(StatusCodes.UNAUTHORIZED, 'User not found. Please log in again.')); 
        if(user.status === "BANNED") return next(new AppError(StatusCodes.FORBIDDEN, "Your account has been blocked. Please contact support."))

        req.user = {email,name,id,role}

        next();
        
    }
)
}