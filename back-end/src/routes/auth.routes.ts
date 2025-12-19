import { Router } from 'express';
import { registerController, loginController, logoutController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { userRegisterSchema, userLoginSchema } from '../models/user.model';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký user mới
 * @access  Public
 */
router.post('/register', validate(userRegisterSchema), registerController);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập user
 * @access  Public
 */
router.post('/login', validate(userLoginSchema), loginController);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất user
 * @access  Private (cần authentication)
 */
router.post('/logout', authMiddleware, logoutController);

export default router;

