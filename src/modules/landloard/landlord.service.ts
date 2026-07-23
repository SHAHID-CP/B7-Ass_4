import { StatusCodes } from "http-status-codes";
import type { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";
import type { CreatePropertyInput } from "./landlord.interface";

const createProperty = async (landlordId: string, input: CreatePropertyInput) => {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid categoryId");
  }

  const property=prisma.property.create({
    data: { ...input, landlordId },
  });

  return property
}; 

const assertOwnership = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    throw new AppError(StatusCodes.NOT_FOUND, "Property not found");
  }
  if (property.landlordId !== landlordId) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not own this property");
  }
  return property;
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  input: Partial<CreatePropertyInput> & { isAvailable?: boolean }
) => {
  await assertOwnership(propertyId, landlordId);
  const updateProperty=prisma.property.update({ where: { id: propertyId }, data: input });
  return updateProperty
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  await assertOwnership(propertyId, landlordId);
  await prisma.property.delete({ where: { id: propertyId } });
};

const getLandlordProperties = async (landlordId: string) => {
  const landProperty=prisma.property.findMany({
    where: { landlordId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return landProperty
};



export const updateRentalStatus = async ( requestId: string,landlordId: string,status: RentalStatus) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!request) {
    throw new AppError(StatusCodes.NOT_FOUND, "Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to update this rental request");
  }
  const updateRental=prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status },
    include: { property: true },
  });

  return updateRental
};


export const propertyService={
    createProperty,
    updateProperty,
    deleteProperty,
    getLandlordProperties,
    updateRentalStatus
}