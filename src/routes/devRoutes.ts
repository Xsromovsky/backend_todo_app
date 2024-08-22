import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../utils/prismaClient";
const router = Router();
// const prisma = new PrismaClient()


router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany()
        res.status(200).json(users)

    } catch (err) {
        res.status(500).json({ err: err });
    }

})

export default router;