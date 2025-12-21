import { Request, Response } from 'express';
import { register, login, logout } from '../services/auth.service';
import { UserRegisterInput, UserLoginInput } from '../models/user.model';
import { asyncHandler, successResponse } from '../utils';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '../constants';

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const userData: UserRegisterInput = req.body;
    const user = await register(userData);
    return successResponse(
      res,
      SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
      user,
      HTTP_STATUS.CREATED
    );
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const loginData: UserLoginInput = req.body;
    const result = await login(loginData);
    return successResponse(res, SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS, result);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID không tồn tại');
    }

    await logout(userId);
    return successResponse(res, SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS);
  }
);
