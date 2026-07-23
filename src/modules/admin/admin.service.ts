import { StatusCodes } from "http-status-codes";
import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const getAllUsers = async () => {
  const users= prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.role === "ADMIN") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Admin accounts' status cannot be changed");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return updated;
};


const getAllProperties = async () => {
  const allProperty=prisma.property.findMany({
    include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return allProperty
};


const getAllRentals = async () => {
  
  const allRentals=prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
  return allRentals
};



export const adminService={
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}