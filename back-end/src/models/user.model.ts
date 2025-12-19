import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '../constants';

// Schema cho User registration
export const userRegisterSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(6, ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT),
  username: z
    .string()
    .min(3, ERROR_MESSAGES.VALIDATION.USERNAME_TOO_SHORT)
    .max(50, ERROR_MESSAGES.VALIDATION.USERNAME_TOO_LONG),
});

// Schema cho User login
export const userLoginSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGES.VALIDATION.FIELD_REQUIRED),
});

// Type inference từ schema
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;

// User document type (cho MongoDB)
export interface UserDocument {
  _id?: ObjectId | string;
  email: string;
  password: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}
