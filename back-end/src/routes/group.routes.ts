import { Router } from 'express';
import {
  createGroupController,
  getGroupsController,
  getGroupDetailsController,
} from '../controllers/group.controller';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createGroupSchema } from '../models/group.model';

const router = Router();

// Tất cả các routes đều cần đăng nhập
router.use(authMiddleware);

router.post('/', validate(createGroupSchema), createGroupController);
router.get('/', getGroupsController);
router.get('/:id', getGroupDetailsController);

export default router;
