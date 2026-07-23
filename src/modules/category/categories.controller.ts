import type { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./categories.service";
import { StatusCodes } from "http-status-codes";

const getAllCategories = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, StatusCodes.OK, "Categories fetched successfully", categories);
});

const createCategory = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const category = await categoryService.createCategory(req.body.name);
  sendSuccess(res, StatusCodes.CREATED, "Category created successfully", category);
});

const deleteCategory = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  await categoryService.deleteCategory(req.params.id as string);
  sendSuccess(res, StatusCodes.OK, "Category deleted successfully",null);
});



export const categoryController={
    getAllCategories,
    createCategory,
    deleteCategory
}