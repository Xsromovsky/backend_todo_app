import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../utils/prismaClient";
// const prisma = new PrismaClient()


export const createNewProject = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const label = req.body.label

    try {
        const project = await prisma.projects.create({
            data: {
                label,
                owner: {
                    connect: { id: userId }
                }
            },
            include:{
                tasks: true
            }
        })
        res.status(201).json(project)

    } catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(500).json({ message: err.message })
            }
        }
        res.status(500).json({ message: err })
    }
}

export const deleteProjectById = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const projectId = req.params.projectId
    try{
        await prisma.projects.delete({
            where: {
                ownerId: userId,
                id: projectId
            }
        })
        
        
        res.status(200).json({message: "project successfully deleted", id: projectId})
    }catch(err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2005') {
                return res.status(404).json({ message: "Project not found" })
            }
        }
        res.status(500).json({ message: err })
    }
}
export const updateProjectById = async (req: Request, res: Response)=>{
    const userId = res.locals.userId;
    const id = req.params.projectId;
    const label = req.body.label
    try{
        const project = await prisma.projects.update({
            where: {
                ownerId: userId,
                id,
            },
            data: {
                label
            }
        })
        res.status(200).json(project)
    }catch(err){
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2005') {
                return res.status(404).json({ message: "Project not found" })
            }
        }
        res.status(500).json({ message: err})
    }
}

export const getAllProjects = async (req: Request, res: Response)=> {
    const userId = res.locals.userId;

    try{
        const projects = await prisma.projects.findMany({
            where:{
                ownerId: userId
            },
            include:{
                tasks:true
            }
        })

        res.status(200).json(projects)
    }catch(err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2005') {
                return res.status(404).json({ message: "Projects not found" })
            }
        }
        res.status(500).json({ message: err })
    }
}

// tasks

export const addTaskToProject = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const { title, description, projectId} = req.body

    try{
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                project:{
                    connect:{id: projectId}
                }
            }
        })
        res.status(201).json(task)
    }catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(500).json({ message: err.message })
            }
        }
        res.status(500).json({ message: err })
    }
}

export const getAllTasksFromProject = async (req: Request, res: Response) => {
    const userId = res.locals.userId
    const projectId = req.params.projectId

    try{
        const tasks = await prisma.projects.findUniqueOrThrow({
            where: {
                ownerId: userId,
                id: projectId
            },
            include: {
                tasks: true
            }
            
        })
        res.status(200).json(tasks)

    }catch (err) {
        console.log(err);
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(500).json({ message: err.message })
            }
            if(err.code === 'P2025'){
                return res.status(404).json({message: "Project not found"})
            }
        }
        res.status(500).json({ message: err })
    }
}

export const updateTaskById = async (req: Request, res: Response) => {
    const userId = res.locals.userId
    const { isDone, title, description, id, projectId } = req.body;

    try{
        console.log(req.body);
        
        const updateTask = await prisma.tasks.update({
            where: {
                id: id,
                projectId: projectId
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

export const deleteTaskById = async (req: Request, res: Response) =>{
    const userId = res.locals.userId
    const taskId = req.params.taskId
    const projectId = req.params.projectId

    try{
        await prisma.tasks.delete({
            where:{
                id: taskId,
                projectId: projectId
            }
        })
        res.status(200).json({message: "Task deleted successfully", taskId, projectId})
       
    }catch(err){
        console.log(err);
        res.status(500).json({message: err})  
    }

}

// PrismaClientKnownRequestError
//"code": "P2002",