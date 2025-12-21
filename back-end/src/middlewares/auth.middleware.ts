import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { errorResponse } from '../utils';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(
        res,
        ERROR_MESSAGES.AUTH.TOKEN_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

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

    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as {
      userId: string;
    };

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
