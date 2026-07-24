import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { rentalService } from "./rental.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const request = await rentalService.createRentalRequest(req.user!.id, req.body.propertyId);
  sendSuccess(res, StatusCodes.CREATED, "Rental request submitted successfully", request);
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const requests = await rentalService.getMyRentalRequests(req.user!.id);
  sendSuccess(res, StatusCodes.OK, "Rental requests fetched successfully", requests);
});


const getRentalRequestById = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const request = await rentalService.getRentalRequestById(
    req.params.id as string,
    req.user!.id,
    req.user!.role
  );
  sendSuccess(res, StatusCodes.OK, "Rental request fetched successfully", request);
});

const cancelRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; 
  const userId = req.user?.id as string; 

  const result = await rentalService.cancelRentalRequestInDB(id as string, userId);
  sendSuccess(res,StatusCodes.OK,"Rental request cancelled successfully",result)
});

export const rentalController={
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
    cancelRentalRequest
}