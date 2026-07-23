import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { propertyService } from "./landlord.service";
import { StatusCodes } from "http-status-codes";

const createProperty = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const property = await propertyService.createProperty(req.user!.id, req.body);
  sendSuccess(res, StatusCodes.CREATED, "Property created successfully", property);
});

const updateProperty = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const property = await propertyService.updateProperty(req.params.id as string, req.user!.id, req.body);
  sendSuccess(res, StatusCodes.OK, "Property updated successfully", property);
});

const deleteProperty = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  await propertyService.deleteProperty(req.params.id as string, req.user!.id);
  sendSuccess(res, StatusCodes.OK, "Property deleted successfully",null);
}); 

const getMyProperties = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const properties = await propertyService.getLandlordProperties(req.user!.id);
  sendSuccess(res, StatusCodes.OK, "Your properties fetched successfully", properties);
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const { status } = req.body;
  const property = await propertyService.updateRentalStatus(req.params.id as string, req.user!.id, status);
  sendSuccess(res, StatusCodes.OK, "Property updated successfully", property);
});



export const landLordController={
    getMyProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    updateRentalStatus
}