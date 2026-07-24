import { StatusCodes } from "http-status-codes";
import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const createRentalRequest = async (tenantId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  
  if (!property) {
    throw new AppError(StatusCodes.NOT_FOUND, "Property not found");
  }

  if (property.landlordId === tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You cannot request to rent your own property");
  }

  if (!property.isAvailable) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This property is not currently available");
  }

  const existingPending = await prisma.rentalRequest.findFirst({
    where: { 
      tenantId, 
      propertyId, 
      status: RentalStatus.PENDING 
    },
  });

  if (existingPending) {
    throw new AppError(StatusCodes.CONFLICT, "You already have a pending request for this property");
  }

  const  rentalPost=prisma.rentalRequest.create({
    data: { tenantId, propertyId },
    include: { property: true },
  });

  return rentalPost
};

const getMyRentalRequests = async (tenantId: string) => {

  const rentals=prisma.rentalRequest.findMany({
    where: { tenantId },
    include: { property: true, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return rentals
};


const getRentalRequestById = async (
  requestId: string,
  userId: string,
  role: "TENANT" | "LANDLORD" | "ADMIN"
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true, payment: true, tenant: { select: { id: true, name: true } } },
  });
  if (!request) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental request not found");
  }

  const isOwnerTenant = request.tenantId === userId;
  const isOwnerLandlord = request.property.landlordId === userId;
  if (role !== "ADMIN" && !isOwnerTenant && !isOwnerLandlord) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not have access to this rental request");
  }

  return request;
};

const cancelRentalRequestInDB = async (rentalRequestId: string, userId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
  });

  if (!rentalRequest) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental request not found!");
  }

  if (rentalRequest.tenantId !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to cancel this rental request!");
  }

  if (rentalRequest.status === RentalStatus.PAID ||rentalRequest.status === RentalStatus.COMPLETED) {
    throw new AppError(StatusCodes.BAD_REQUEST,`Cannot cancel request because it is already ${rentalRequest.status.toLowerCase()}!`);
  }

  if (rentalRequest.status === RentalStatus.CANCELLED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This rental request is already cancelled!");
  }

  if (rentalRequest.status === RentalStatus.REJECTED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This rental request was rejected by the landlord!");
  }

  const updatedRentalRequest = await prisma.rentalRequest.update({
    where: { id: rentalRequestId },
    data: {
      status: RentalStatus.CANCELLED,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          price: true,
          location: true,
        },
      },
    },
  });

  return updatedRentalRequest;
};



export const rentalService={
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
    cancelRentalRequestInDB
}