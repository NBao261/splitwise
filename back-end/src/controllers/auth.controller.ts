import { Request, Response } from 'express';
import { register, login, logout } from '../services/auth.service';
import { UserRegisterInput, UserLoginInput } from '../models/user.model';
import { asyncHandler, successResponse } from '../utils';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '../constants';

/**
 * Controller xử lý đăng ký user mới
 * Request body đã được validate bởi validate middleware
 */
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const userData: UserRegisterInput = req.body; // Đã được validate và parse
    const user = await register(userData);
    return successResponse(
      res,
      SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
      user,
      HTTP_STATUS.CREATED
    );
  }
);

/**
 * Controller xử lý đăng nhập user
 * Request body đã được validate bởi validate middleware
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const loginData: UserLoginInput = req.body; // Đã được validate và parse
    const result = await login(loginData);
    return successResponse(res, SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS, result);
  }
);

/**
 * Controller xử lý đăng xuất user
 * Yêu cầu authentication (authMiddleware)
 */
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
