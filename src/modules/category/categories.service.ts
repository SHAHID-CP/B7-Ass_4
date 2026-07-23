import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const getAllCategories = async () => {
  const allCategory=prisma.category.findMany({ orderBy: { name: "asc" } });
  return allCategory
};

const createCategory = async (name: string) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    throw new AppError(StatusCodes.CONFLICT, "Category already exists");
  }
  const category=prisma.category.create({ data: { name } });
  return category;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
  await prisma.category.delete({ where: { id } });
};

export const categoryService={
    getAllCategories,
    createCategory,
    deleteCategory
}