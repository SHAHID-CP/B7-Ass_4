import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";
import type { CreateReviewPayload } from "./reviews.interface";



const createReview = async (tenantId: string, payload: CreateReviewPayload) => {
  const { propertyId, rating, comment } = payload;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  if (!property) {
    throw new AppError(StatusCodes.NOT_FOUND, "Property not found");
  }

  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId,
      status: "PAID",
    },
  });

  if (!completedRental) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only review properties that you have rented and paid for!"
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      propertyId,
      tenantId,
    },
  });

  if (existingReview) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "You have already submitted a review for this property"
    );
  }

  const review = await prisma.review.create({
    data: {
      propertyId,
      tenantId,
      rentalRequestId: completedRental.id,
      rating,
      comment,
    },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
  });

  return review;
};

const getPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = await prisma.review.aggregate({
    where: { propertyId },
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    reviews,
    totalReviews: stats._count.id,
    averageRating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
  };
};

const getLandlordReviews = async (landlordId: string) => {
  const landLordReviews = await prisma.review.findMany({
    where: {
      property: {
        landlordId: landlordId,
      },
    },
    include: {
      tenant: { 
        select: { id: true, name: true, email: true } 
      },
      property: { 
        select: { id: true, title: true, location: true, price: true } 
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return landLordReviews;
};


const getAllReviews = async () => {
    const allReviews=await prisma.review.findMany({
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return allReviews
};

export const reviewService = {
  createReview,
  getPropertyReviews,
  getLandlordReviews,
  getAllReviews,
};