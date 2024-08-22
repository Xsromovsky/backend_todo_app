import { Router } from "express";
import { accessTokenAuth } from "../middleware/auth";
import { addTaskToProject, createNewProject, deleteProjectById, deleteTaskById, getAllProjects, getAllTasksFromProject, updateProjectById, updateTaskById } from "../controllers/task/projectController";

const router = Router();


// project
router.post('/add', accessTokenAuth, createNewProject)
router.delete('/:projectId', accessTokenAuth, deleteProjectById)
router.put('/:projectId', accessTokenAuth, updateProjectById)
router.get('/all', accessTokenAuth, getAllProjects)

// project tasks
router.post('/task/add', accessTokenAuth, addTaskToProject)
router.get('/task/all/:projectId', accessTokenAuth, getAllTasksFromProject)
router.put('/task/update', accessTokenAuth, updateTaskById)
router.delete('/task/:projectId/:taskId', accessTokenAuth, deleteTaskById)

export default router;