import { Router, Request, Response } from "express";
import { addTask, deleteTaskById, getTasksByUserId, editTask, getSingleTaskById } from "../controllers/taskController";
import { accessTokenAuth } from "../middleware/auth";

const router = Router();

router.post('/add', accessTokenAuth, addTask)
// router.post('/edit', loginUser)
router.get('/all', accessTokenAuth, getTasksByUserId)
// router.get('/all', accessTokenAuth, )
router.delete('/:taskId', accessTokenAuth, deleteTaskById)
router.put('/:taskId', accessTokenAuth, editTask)
router.get('/:taskId', accessTokenAuth, getSingleTaskById)
export default router;