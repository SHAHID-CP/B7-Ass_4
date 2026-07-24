import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError, sendSuccess } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { clearAuthCookies, setAuthCookies } from "../../utils/cookies";


const register = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
    const payload = req.body;
    const {accessToken, refreshToken,user} = await authService.registerUser(payload);
    setAuthCookies(res, accessToken, refreshToken);
    sendSuccess(res, StatusCodes.CREATED, "User registered successfully", user);
});

const login = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
    const payload = req.body;
    const {accessToken, refreshToken,user} = await authService.loginUser(payload);
    setAuthCookies(res, accessToken, refreshToken);
    sendSuccess(res, StatusCodes.OK, "Login successful", user );
});

const logout = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  clearAuthCookies(res);
  sendSuccess(res, StatusCodes.OK, "Logged out successfully");
});

const refreshToken = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "No refresh token provided");
    }

  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(
    refreshToken
  );
  setAuthCookies(res, accessToken, newRefreshToken);
  sendSuccess(res, StatusCodes.OK, "Access token refreshed successfully");
});


const getMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const profile = await authService.getMyProfileFromDB(req.user?.id as string);
    sendSuccess(res, StatusCodes.OK, "Current user fetched", profile );
})

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const payload = req.body;

  const updatedProfile = await authService.updateProfileInDB(userId, payload);
  sendSuccess(res,StatusCodes.OK,"Profile updated successfully",updatedProfile)
});


export const authController={
    register,
    login,
    logout,
    refreshToken,
    getMyProfile,
    updateMyProfile
}