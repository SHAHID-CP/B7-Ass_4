import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { LoginInput, RegisterInput, TUpdateProfilePayload } from "./auth.interface"
import config from "../../config";
import { AppError } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { jwtUtils } from "../../utils/jwt";
import type { JwtPayload, SignOptions } from "jsonwebtoken";


const issueTokenPair = async (payload : JwtPayload) => {
  const accessToken =jwtUtils.createToken(payload,config.jwt_access_secret,config.jwt_access_expires_in as SignOptions )
  const refreshToken = jwtUtils.createToken(payload,config.jwt_refresh_secret,config.jwt_refresh_expires_in as SignOptions )
  return { accessToken, refreshToken };
};

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

    const jwtPayload = { id: user?.id, name: user?.name, email: user?.email,role: user?.role}
    const tokens = await issueTokenPair(jwtPayload);

    return {user,...tokens};
}



export const loginUser = async (payload: LoginInput) => {

  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email }});
  
  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }
  if (user.status === "BANNED" || user.status === "SUSPENDED") {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account has been banned or susspended");
  }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const jwtPayload = { id: user?.id, name: user?.name, email: user?.email,role: user?.role}
    const tokens = await issueTokenPair(jwtPayload);
    const { password: _, ...safeUser } = user;

  return { user: safeUser, ...tokens };
};

const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if(!verifiedRefreshToken.success){
        throw new AppError(StatusCodes.BAD_REQUEST,verifiedRefreshToken.error)
    }

    const {id} = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.status === "BANNED" || user.status === "SUSPENDED") {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Account is no longer accessible");
    }

    const jwtPayload = { id: user?.id, name: user?.name, email: user?.email,role: user?.role}
    const tokens = await issueTokenPair(jwtPayload);

    return {...tokens};
};

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

const updateProfileInDB = async (userId: string,payload: TUpdateProfilePayload)=> {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
      status: "ACTIVE",
    },
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found or inactive!");
  }


  const updatedData: TUpdateProfilePayload = {};

  if (payload.name) updatedData.name = payload.name;
  if (payload.phoneNumber) updatedData.phoneNumber = payload.phoneNumber;
  if (payload.profileImage) updatedData.profileImage = payload.profileImage;


  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      profileImage: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};


export const authService={
    registerUser,
    loginUser,
    refreshToken,
    getMyProfileFromDB,
    updateProfileInDB
}