import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { errorResponse } from '../utils';

/**
 * Middleware xác thực JWT token
 * Lấy token từ Header Authorization -> Verify -> Gán userId vào req.user
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy token từ Header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(
        res,
        ERROR_MESSAGES.AUTH.TOKEN_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Format: "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return errorResponse(
        res,
        ERROR_MESSAGES.AUTH.TOKEN_INVALID,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Verify token
    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as {
      userId: string;
    };

    // Gán userId vào req.user
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return errorResponse(
        res,
        ERROR_MESSAGES.AUTH.TOKEN_INVALID_OR_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (error instanceof jwt.TokenExpiredError) {
      return errorResponse(
        res,
        ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    return errorResponse(
      res,
      ERROR_MESSAGES.AUTH.AUTH_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
