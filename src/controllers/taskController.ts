import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const addTask = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const userId = res.locals.userId;

    try {
        const newTask = await prisma.tasks.create({
            data: {
                title,
                description,
                owner: {
                    connect: { id: userId }
                }
            }
        })
        res.status(201).json(newTask)
        await prisma.$disconnect()

    } catch (err) {
        res.status(500).json({ error: `there is an error: ${err}` })
    }
}

export const deleteTaskById = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const taskId = parseInt(req.params.taskId);

    try {
        console.log("taskId: " + taskId + " userId: " + userId);
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        await prisma.tasks.delete({
            where: {
                id: taskId,
                ownerId: userId
            }
        })

        res.status(200).json({ message: "task is successfully deleted" })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(404).json({ error: `task with id: ${taskId} not found` })
        }
        res.status(500).json({ error: `there is an error with deleting: ${err}` })
    }
}

export const editTask = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const taskId = parseInt(req.params.taskId);
    const { isDone, title, description } = req.body;

    try {
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }
        const updatedTask = await prisma.tasks.update({
            where: {
                id: taskId,
                ownerId: userId
            },
            data: {
                isDone,
                title,
                description,
            }
        })

        res.status(200).json(updatedTask)
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(404).json({ error: `task with id: ${taskId} not found` })
        }
        res.status(500).json({ error: `there is an error with task: ${err}` })
    }
}
export const getSingleTaskById = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const taskId = parseInt(req.params.taskId);

    try{
        if(isNaN(taskId)){
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const currentTask = await prisma.tasks.findUniqueOrThrow({
            where:{
                id: taskId,
                ownerId: userId,
            }
        })

        res.status(200).json({currentTask})


    }catch(err){
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            if(err.code === 'P2025'){

            }
        }
    }

}

export const getTasksByUserId = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    try {
        const tasks = await prisma.tasks.findMany({
            where: { ownerId: userId }
        });

        // if (!tasks) {
        //     return res.status(404).json({ message: "No tasks found for this user" });
        // }

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};
