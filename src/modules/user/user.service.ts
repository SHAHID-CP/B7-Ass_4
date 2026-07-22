import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/sendResponse";

const getMyProfileFromDB = async (userId : string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where : {id : userId},
        omit : {
            password : true
        }
    });
    if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
}

export const userService = {
    getMyProfileFromDB
}