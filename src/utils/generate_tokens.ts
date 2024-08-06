import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken"

const prisma = new PrismaClient()

export const ACCESS_SECRET_KEY: Secret = 'your-access-secret-key-here';
export const REFRESH_SECRET_KEY: Secret = 'your-refresh-secret-key-here';


export const generateAccessToken = (userId: number) => {
    return jwt.sign({_id: userId}, ACCESS_SECRET_KEY, {
        expiresIn: "3 hours"
    })
}

export const generateRefreshToken = (userId: number) => {
    return jwt.sign({_id: userId}, REFRESH_SECRET_KEY, {
        expiresIn: "1 day"
    })
}

