import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const getAllCategories = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const createCategory = async (name: string) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    throw new AppError(409, "Category already exists");
  }
  return prisma.category.create({ data: { name } });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  await prisma.category.delete({ where: { id } });
};

export const categoryService={
    getAllCategories,
    createCategory,
    deleteCategory
}