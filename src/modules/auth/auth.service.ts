import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { RegisterInput } from "./auth.interface"
import config from "../../config";
import { AppError } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const registerUser=async(payload:RegisterInput)=>{
    const { name, email, password, role } = payload;
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new AppError(StatusCodes.NOT_FOUND,"User with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        }
    })

    return user;
}

export const authService={
    registerUser
}