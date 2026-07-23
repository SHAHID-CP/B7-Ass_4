import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { StatusCodes } from "http-status-codes";


const getAllUsers = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const users = await adminService.getAllUsers();
  sendSuccess(res, StatusCodes.OK, "Users fetched successfully", users);
});

const updateUserStatus = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const user = await adminService.updateUserStatus(req.params.id as string, req.body.status);
  sendSuccess(res, StatusCodes.OK, `User status updated to ${user.status}`, user);
});

const getAllProperties = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const properties = await adminService.getAllProperties();
  sendSuccess(res, StatusCodes.OK, "All properties fetched successfully", properties);
});

export const getAllRentals = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const rentals = await adminService.getAllRentals();
  sendSuccess(res, StatusCodes.OK, "All rental requests fetched successfully", rentals);
});



export const adminController={
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}