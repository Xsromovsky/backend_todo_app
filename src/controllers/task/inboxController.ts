import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../../utils/prismaClient";
// const prisma = new PrismaClient()

export const getAllTasks = async (req: Request, res: Response)=>{
    const userId = res.locals.userId

    try{
        const currentUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include:{
                inbox: {
                    include: {
                        tasks: true
                    }
                }
            }
        })
        res.status(200).json(currentUser.inbox?.tasks)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})
        
    }
}

export const addTaskToInbox = async (req: Request, res: Response)=> {
    const userId = res.locals.userId
    const { title, description } = req.body;


    try{
        const currentUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include:{
                inbox: true
            }
        })

        const task = await prisma.tasks.create({
            data:{
                title,
                description,
                inbox_tasks:{
                    connect:{id: currentUser.inbox?.id}
                }
            }
        })
        res.status(201).json(task)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})
        
    }
}

export const updateTask = async (req: Request, res: Response) => {
    // const userId = res.locals.userId
    const { isDone, title, description, inbox_taskId, id } = req.body;
    try{

        const updateTask = await prisma.tasks.update({
            where: {
                id: id,
                inbox_taskId: inbox_taskId
            },
            data:{
                title,
                description,
                isDone
            }
        })
        res.status(200).json(updateTask)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})  
    }
}

export const deleteTaskById = async (req: Request, res: Response) => {
    const userId = res.locals.userId
    const taskId = req.params.taskId

    try{
        const deleteTask = await prisma.tasks.delete({
            where: {
                id: taskId
            }
        })
        res.status(200).json({message: "task deleted successfully"})
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})  
    }
}