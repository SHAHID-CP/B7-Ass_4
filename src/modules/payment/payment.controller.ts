import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { StatusCodes } from "http-status-codes";



const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createCheckoutSession(req.user!.id,req.body.rentalRequestId);

  sendSuccess(res, StatusCodes.CREATED, "Checkout session created successfully", result);
});

const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const payments = await paymentService.getUserPaymentHistory(req.user!.id, req.user!.role);
  sendSuccess(res, StatusCodes.OK, "Payment history fetched successfully", payments);
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(req.params.id as string, req.user!.id, req.user!.role);
  sendSuccess(res, StatusCodes.OK, "Payment fetched successfully", payment);
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const result = await paymentService.handleWebhookEvent(sig, req.body);

  res.status(StatusCodes.OK).json(result);
});

export const paymentController={
    createPaymentIntent,
    getPaymentById,
    getPaymentHistory,
    handleStripeWebhook
    
}