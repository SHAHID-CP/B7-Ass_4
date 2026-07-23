import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";
import type { CreatePropertyInput } from "./landlord.interface";

const createProperty = async (landlordId: string, input: CreatePropertyInput) => {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) {
    throw new AppError(400, "Invalid categoryId");
  }

  return prisma.property.create({
    data: { ...input, landlordId },
  });
};

const assertOwnership = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    throw new AppError(404, "Property not found");
  }
  if (property.landlordId !== landlordId) {
    throw new AppError(403, "You do not own this property");
  }
  return property;
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  input: Partial<CreatePropertyInput> & { isAvailable?: boolean }
) => {
  await assertOwnership(propertyId, landlordId);
  return prisma.property.update({ where: { id: propertyId }, data: input });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  await assertOwnership(propertyId, landlordId);
  await prisma.property.delete({ where: { id: propertyId } });
};

const getLandlordProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
};


export const propertyService={
    createProperty,
    updateProperty,
    deleteProperty,
    getLandlordProperties,
    // patchProperty
}