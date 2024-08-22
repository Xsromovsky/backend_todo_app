import { Router} from "express";
import { accessTokenAuth } from "../middleware/auth";
import { addTaskToInbox, deleteTaskById, getAllTasks, updateTask } from "../controllers/task/inboxController";

const router = Router();
// inbox tasks
router.post('/inbox/add', accessTokenAuth, addTaskToInbox)
router.put('/inbox', accessTokenAuth, updateTask)
router.get('/inbox/all', accessTokenAuth, getAllTasks)
router.delete('/inbox/:taskId', accessTokenAuth, deleteTaskById)

// project


export default router;