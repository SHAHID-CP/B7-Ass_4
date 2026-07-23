import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { propertyService } from "./properties.service";
import { StatusCodes } from "http-status-codes";

const getAllProperties = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const query = (req as any).validatedQuery || req.query;
  const result = await propertyService.getAllProperties(query);
  sendSuccess(res, StatusCodes.OK, "Properties fetched successfully", result);
});

const getPropertyById = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const property = await propertyService.getPropertyById(req.params.id as string);
  sendSuccess(res,StatusCodes.OK, "Property fetched successfully", property);
});

export const propertyController={
    getAllProperties,
    getPropertyById
}