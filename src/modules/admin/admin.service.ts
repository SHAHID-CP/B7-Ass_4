import { StatusCodes } from "http-status-codes";
import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";
import type { IGetAllUsersQuery } from "./admin.interface";

const getAllUsers = async (query: IGetAllUsersQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { searchTerm, role } = query;


  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (role && role !== "ALL") {
    andConditions.push({
      role: role,
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};


  const users = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
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

const getStats = async () => {
  const [totalUsers,totalProperties,pendingRentalRequests,totalPayments,revenueAggregate,activeLandlords,activeTenants,] = await Promise.all([

    prisma.user.count(),
    prisma.property.count(),
    prisma.rentalRequest.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.payment.count(),
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.user.count({
      where: {
        role: "LANDLORD",
        status: "ACTIVE",
      },
    }),
    prisma.user.count({
      where: {
        role: "TENANT",
        status: "ACTIVE",
      },
    }),
  ]);

  return {
    totalUsers,
    totalProperties,
    pendingRentalRequests,
    totalPayments,
    totalRevenue: revenueAggregate._sum.amount || 0,
    activeLandlords,
    activeTenants,
  };
};



export const adminService={
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
    getStats
}