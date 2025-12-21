import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { userRegisterSchema, userLoginSchema } from '../models/user.model';

const router = Router();

router.post('/register', validate(userRegisterSchema), registerController);
router.post('/login', validate(userLoginSchema), loginController);
router.post('/logout', authMiddleware, logoutController);

export default router;
