import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { handleZodError } from '../utils/error.util';

/**
 * Middleware để validate request body với Zod schema
 * @param schema - Zod schema để validate
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate và parse request body
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = handleZodError(error);
        return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST);
      }
      return errorResponse(
        res,
        ERROR_MESSAGES.VALIDATION.INVALID_INPUT,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  };
};
