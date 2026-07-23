import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const getAllUsers = async () => {
  return prisma.user.findMany({
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
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role === "ADMIN") {
    throw new AppError(400, "Admin accounts' status cannot be changed");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  return updated;
};


const getAllProperties = async () => {
  return prisma.property.findMany({
    include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
};

// ---- Rentals ----

const getAllRentals = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      property: true,
      tenant: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};



export const adminService={
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}