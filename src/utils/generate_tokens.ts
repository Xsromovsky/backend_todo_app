import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken"
import prisma from "./prismaClient";
// const prisma = new PrismaClient()

export const ACCESS_SECRET_KEY: Secret = 'your-access-secret-key-here';
export const REFRESH_SECRET_KEY: Secret = 'your-refresh-secret-key-here';


export const generateAccessToken = (userId: String) => {
    return jwt.sign({_id: userId}, ACCESS_SECRET_KEY, {
        expiresIn: "1 day"
    })
}

export const generateRefreshToken = (userId: String) => {
    return jwt.sign({_id: userId}, REFRESH_SECRET_KEY, {
        expiresIn: "10 days"
    })
}
