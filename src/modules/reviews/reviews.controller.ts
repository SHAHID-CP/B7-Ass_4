
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { reviewService } from "./reviews.service";
import type { Request, Response } from "express";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReview(req.user!.id, req.body);
  sendSuccess(res, StatusCodes.CREATED, "Review created successfully", result);
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getPropertyReviews(req.params.propertyId as string);
  sendSuccess(res, StatusCodes.OK, "Property reviews fetched successfully", result);
});

const getLandlordReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getLandlordReviews(req.user!.id);
  sendSuccess(res, StatusCodes.OK, "Landlord reviews fetched successfully", result);
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviews();
  sendSuccess(res, StatusCodes.OK, "All reviews fetched successfully", result);
});

export const reviewController = {
  createReview,
  getPropertyReviews,
  getLandlordReviews,
  getAllReviews,
};