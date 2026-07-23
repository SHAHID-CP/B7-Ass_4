import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const createRentalRequest = async (tenantId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  
  if (!property) {
    throw new AppError(404, "Property not found");
  }

  if (property.landlordId === tenantId) {
    throw new AppError(400, "You cannot request to rent your own property");
  }

  if (!property.isAvailable) {
    throw new AppError(400, "This property is not currently available");
  }

  const existingPending = await prisma.rentalRequest.findFirst({
    where: { 
      tenantId, 
      propertyId, 
      status: RentalStatus.PENDING 
    },
  });

  if (existingPending) {
    throw new AppError(409, "You already have a pending request for this property");
  }

  return prisma.rentalRequest.create({
    data: { tenantId, propertyId },
    include: { property: true },
  });
};

const getMyRentalRequests = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: { tenantId },
    include: { property: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
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
    throw new AppError(404, "Rental request not found");
  }

  const isOwnerTenant = request.tenantId === userId;
  const isOwnerLandlord = request.property.landlordId === userId;
  if (role !== "ADMIN" && !isOwnerTenant && !isOwnerLandlord) {
    throw new AppError(403, "You do not have access to this rental request");
  }

  return request;
};



export const rentalService={
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById
}