import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";


export const register = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = await authService.registerUser(payload);
//   setAuthCookies(res, accessToken, refreshToken);
  sendSuccess(res, StatusCodes.CREATED, "User registered successfully", user);
});


export const authController={
    register
}