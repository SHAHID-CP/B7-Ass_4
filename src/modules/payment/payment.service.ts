import type Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/sendResponse";
import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import { StatusCodes } from "http-status-codes";


//Stripe Checkout Session
const createCheckoutSession = async (tenantId: string, rentalRequestId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental request not found");
  }
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to pay for this rental request");
  }
  if (rentalRequest.status !== "APPROVED") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Rental request is not approved yet");
  }
  const existingPayment = await prisma.payment.findFirst({
    where: { rentalRequestId, status: "COMPLETED" },
  });

  if (existingPayment) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment has already been completed for this rental");
  }


  // Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rentalRequest.property.title,
            description: `Rental payment for ${rentalRequest.property.location}`,
          },
          unit_amount: Math.round(rentalRequest.property.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      rentalRequestId,
      tenantId,
    },
    success_url : `${config.app_url}/payment?success=true`,
    cancel_url: `${config.app_url}/payment?success=false`,
  });

    await prisma.payment.create({
    data: {
      rentalRequestId,
      transactionId: session.id,
      amount: rentalRequest.property.price,
      provider: "stripe",
      status: "PENDING",
    },
  });

  return { checkoutUrl: session.url, sessionId: session.id };
};




//...........................................................................


const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const rentalRequestId = session.metadata?.rentalRequestId;
  if (!rentalRequestId) return;

  const payment = await prisma.payment.findUnique({ where: { transactionId: session.id } });
  if (!payment) return; // nothing to reconcile

  await prisma.payment.update({
    where: { transactionId: session.id },
    data: { status: "COMPLETED", paidAt: new Date() },
  });

  await prisma.rentalRequest.update({
    where: { id: rentalRequestId },
    data: { status: "PAID" },
  });
};

const handleCheckoutFailed = async (session: Stripe.Checkout.Session) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId: session.id } });
  if (!payment) return;

  await prisma.payment.update({
    where: { transactionId: session.id },
    data: { status: "FAILED" },
  });
};


//............................................................................


// Stripe Webhook
const handleWebhookEvent = async (sig: string, rawBody: Buffer) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripe_webhook_secret as string
    );
  } catch (err: any) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "checkout.session.async_payment_failed":
      await handleCheckoutFailed(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      break;
  }

  return { received: true };
};


// User Payment History
const getUserPaymentHistory = async (tenantId: string, role: string) => {
  if (role === Role.ADMIN) {
      return await prisma.payment.findMany({
      include: {
        rentalRequest: {
          include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return await prisma.payment.findMany({
    where: { rentalRequest: { tenantId } },
    include: {
      rentalRequest: { include: { property: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};


// Single Payment Details 
const getPaymentById = async (paymentId: string, userId: string, role:"TENANT" | "ADMIN" | "LANDLORD" ) => {
const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Payment not found");
  }

  const isTenant = payment.rentalRequest.tenantId === userId;

  if (role !== "ADMIN" && !isTenant ) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not have access to view this payment");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhookEvent,
  getUserPaymentHistory,
  getPaymentById,
};