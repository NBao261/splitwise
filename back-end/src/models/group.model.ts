import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from '../constants';

// Schema cho tạo Group mới
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, ERROR_MESSAGES.VALIDATION.FIELD_REQUIRED)
    .max(100, 'Tên nhóm không được quá 100 ký tự'),
  description: z.string().optional(),
});

// Schema cho thêm thành viên vào Group
export const addMemberSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;

export interface GroupDocument {
  _id?: ObjectId | string;
  name: string;
  description?: string;
  ownerId: ObjectId | string;
  members: (ObjectId | string)[];
  createdAt: Date;
  updatedAt: Date;
}
