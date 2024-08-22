import { PrismaClient } from "@prisma/client";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from "../utils/generate_tokens";
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import prisma from "../utils/prismaClient";
// const prisma = new PrismaClient()

export const accessTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Token is required')
        }

        try {
            const decoded_token = jwt.verify(token, ACCESS_SECRET_KEY) as JwtPayload;
            const currentUser = await prisma.user.findUnique({
                where: {
                    id: decoded_token._id
                }
            })

            if (!currentUser) {
                return res.status(404).json({ message: "User not found" })
            } else {
                res.locals.userId = currentUser.id
                next();

            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Token expired" })
            }
            return res.status(403).json({ message: "Invalid token" })
        }
    } catch (err) {
        res.status(403).json({ message: "Token is required" });
    }
}




export const refreshTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.body.refreshToken?.replace('Bearer ', '');

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token is required" });
        }

        const decoded_refresh_token = jwt.verify(refreshToken, REFRESH_SECRET_KEY) as JwtPayload;
        const currentUser = await prisma.user.findUnique({
            where: {
                id: decoded_refresh_token._id,
                refresh_token: refreshToken,
            }
        });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        req.body.userId = currentUser.id;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Refresh token expired" });
        }
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
