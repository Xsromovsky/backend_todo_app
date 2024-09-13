import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { Prisma, PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "../utils/generate_tokens";
import prisma from "../utils/prismaClient";
// const prisma = new PrismaClient()


export const signupUser = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    try {
        console.log(`${username} - ${password} - ${email}`);

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword
            }
        })
        const inbox = await prisma.inboxTasks.create({
            data: {
                owner: {
                    connect: { id: user.id }
                }
            }
        })
        res.status(201).json({ message: "User successfully created" })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({ message: 'Email address already in use' })
            }
        }
        console.log("Error: ", error);
        res.status(500).json({ message: "Error creating user" })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const password = req.body.password;
    const email = req.body.email;
    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {

            const accessToken = generateAccessToken(user.id)
            const refreshToken = generateRefreshToken(user.id)
            await prisma.user.update({
                where: {
                    email: user.email
                },
                data: {
                    refresh_token: refreshToken
                }
            });
            res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}
export const logout = async (req: Request, res: Response) => {
    const userId = res.locals.userId;

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refresh_token: null
            }
        })
        res.status(200).json({ message: 'User logged out' });
    } catch (err) {

    }
}

export const getUserDetails = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                email: true,
                name: true,
                refresh_token: true,
            }
        })
        if (!user) {
            // return res.status(404).json({ message: "User not found" });
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}


export const refreshToken = async (req: Request, res: Response) => {
    const userId = req.body.userId;

    try {
        const accessToken = generateAccessToken(userId);

        res.status(201).json({ accessToken: accessToken });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.status(200).json({ users: users })
}