import { Router, Request, Response } from "express";
import { signupUser, loginUser, getUserDetails, refreshToken, getAllUsers, logout } from '../controllers/userController'
import { accessTokenAuth, refreshTokenAuth } from "../middleware/auth";

const router = Router();

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/profile', accessTokenAuth, getUserDetails)
router.post('/refresh_token', refreshTokenAuth, refreshToken)
router.get('/users', getAllUsers)
router.get('/logout', accessTokenAuth, logout)


export default router;