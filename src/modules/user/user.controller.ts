import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../../utils/sendResponse";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";

const getMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {

    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendSuccess(res, StatusCodes.OK, "Current user fetched", profile );
})


export const userController = {
    getMyProfile
}