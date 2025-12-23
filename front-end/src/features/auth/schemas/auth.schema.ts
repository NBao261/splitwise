import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  username: z
    .string()
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(50, 'Tên người dùng không được vượt quá 50 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
