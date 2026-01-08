import { Request, Response } from 'express';
import {
  createGroup,
  getUserGroups,
  getGroupDetails,
} from '../services/group.service';
import { CreateGroupInput } from '../models/group.model';
import { asyncHandler, successResponse } from '../utils';
import { HTTP_STATUS } from '../constants';

export const createGroupController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID not found');

    const groupData: CreateGroupInput = req.body;
    const group = await createGroup(userId, groupData);

    return successResponse(
      res,
      'Tạo nhóm thành công',
      group,
      HTTP_STATUS.CREATED
    );
  }
);

export const getGroupsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID not found');

    const groups = await getUserGroups(userId);

    return successResponse(res, 'Lấy danh sách nhóm thành công', groups);
  }
);

export const getGroupDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID not found');

    const { id } = req.params;
    const group = await getGroupDetails(id, userId);

    return successResponse(res, 'Lấy chi tiết nhóm thành công', group);
  }
);
