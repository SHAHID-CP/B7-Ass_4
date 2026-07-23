import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";
import type { PropertyQuery } from "./properties.interface";

const getAllProperties = async (query: PropertyQuery) => {
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;

  const location = query.location;
  const categoryId = query.categoryId;
  
  const minPrice = query.minPrice !== undefined ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined;

  const where: any = { isAvailable: true };

  if (location) {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) where.price.gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) where.price.lte = maxPrice;
  }

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        category: true,
        landlord: { select: { id: true, name: true } },
      },
      skip, 
      take: limit, 
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: { select: { id: true, name: true } },
      reviews: { include: { tenant: { select: { id: true, name: true } } } },
    },
  });

  if (!property) {
    throw new AppError(StatusCodes.NOT_FOUND, "Property not found");
  }

  return property;
};

export const propertyService = {
  getPropertyById,
  getAllProperties,
};