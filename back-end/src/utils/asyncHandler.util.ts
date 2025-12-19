import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper để bắt lỗi async trong Express route handlers
 * Giúp tránh phải try-catch trong mỗi controller
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

