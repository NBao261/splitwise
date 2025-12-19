import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db';
import { envConfig } from '../config/env.config';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { AppError } from '../utils';
import {
  UserRegisterInput,
  UserLoginInput,
  UserDocument,
} from '../models/user.model';
import { userRegisterSchema, userLoginSchema } from '../models/user.model';

/**
 * Đăng ký user mới
 * @param userData - Thông tin đăng ký (email, password, username)
 * @returns User document (không bao gồm password)
 */
export async function register(userData: UserRegisterInput) {
  // Input đã được validate ở middleware, nhưng vẫn validate lại để đảm bảo type safety
  const validatedData = userRegisterSchema.parse(userData);

  const db = getDb();
  if (!db) {
    throw new AppError(
      ERROR_MESSAGES.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const usersCollection = db.collection<UserDocument>('users');

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await usersCollection.findOne({
    email: validatedData.email,
  });
  if (existingUser) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    validatedData.password,
    envConfig.BCRYPT_SALT_ROUNDS
  );

  // Tạo user mới
  const newUser: Omit<UserDocument, '_id'> = {
    email: validatedData.email,
    password: hashedPassword,
    username: validatedData.username,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

  // Kiểm tra insert thành công
  if (!result.insertedId) {
    throw new AppError(
      ERROR_MESSAGES.USER.CREATE_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // Trả về user (không bao gồm password) - tối ưu: không cần query lại
  const { password: _, ...userWithoutPassword } = {
    _id: result.insertedId.toString(),
    ...newUser,
  };

  return userWithoutPassword;
}

/**
 * Đăng nhập user
 * @param loginData - Thông tin đăng nhập (email, password)
 * @returns JWT token và thông tin user
 */
export async function login(loginData: UserLoginInput) {
  // Input đã được validate ở middleware, nhưng vẫn validate lại để đảm bảo type safety
  const validatedData = userLoginSchema.parse(loginData);

  const db = getDb();
  if (!db) {
    throw new AppError(
      ERROR_MESSAGES.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const usersCollection = db.collection<UserDocument>('users');

  // Tìm user theo email
  const user = await usersCollection.findOne({ email: validatedData.email });
  if (!user) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Kiểm tra password
  const isPasswordValid = await bcrypt.compare(
    validatedData.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Tạo JWT token
  let userId: string;
  if (user._id instanceof ObjectId) {
    userId = user._id.toString();
  } else if (typeof user._id === 'string') {
    userId = user._id;
  } else {
    throw new AppError(
      ERROR_MESSAGES.AUTH.USER_ID_NOT_FOUND,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const token = jwt.sign({ userId }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  } as SignOptions);

  // Trả về token và user (không bao gồm password)
  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: {
      ...userWithoutPassword,
      _id: userId,
    },
  };
}

/**
 * Đăng xuất user
 * Với JWT stateless, logout chỉ cần verify token hợp lệ
 * Client sẽ tự xóa token sau khi nhận response thành công
 * @param userId - User ID từ token (string)
 * @returns Success message
 */
export async function logout(userId: string) {
  // Verify user tồn tại (optional - để đảm bảo user hợp lệ)
  const db = getDb();
  if (!db) {
    throw new AppError(
      ERROR_MESSAGES.SERVER.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const usersCollection = db.collection<UserDocument>('users');

  // Convert userId string to ObjectId
  let userObjectId: ObjectId;
  try {
    userObjectId = new ObjectId(userId);
  } catch (error) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.USER_ID_NOT_FOUND,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const user = await usersCollection.findOne({ _id: userObjectId });

  if (!user) {
    throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Với JWT stateless, không cần làm gì thêm
  // Client sẽ tự xóa token
  // Nếu muốn bảo mật hơn, có thể implement token blacklist ở đây

  return { message: 'Đăng xuất thành công' };
}
