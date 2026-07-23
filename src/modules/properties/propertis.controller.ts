import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { propertyService } from "./properties.service";

const getAllProperties = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const query = (req as any).validatedQuery || req.query;
  const result = await propertyService.getAllProperties(query);
  sendSuccess(res, 200, "Properties fetched successfully", result);
});

const getPropertyById = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const property = await propertyService.getPropertyById(req.params.id as string);
  sendSuccess(res, 200, "Property fetched successfully", property);
});

export const propertyController={
    getAllProperties,
    getPropertyById
}