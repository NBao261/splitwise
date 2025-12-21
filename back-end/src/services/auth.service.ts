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

export async function register(userData: UserRegisterInput) {
  const db = getDb();
  const usersCollection = db.collection<UserDocument>('users');

  const existingUser = await usersCollection.findOne({
    email: userData.email,
  });
  if (existingUser) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT
    );
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    envConfig.BCRYPT_SALT_ROUNDS
  );

  const newUser: Omit<UserDocument, '_id'> = {
    email: userData.email,
    password: hashedPassword,
    username: userData.username,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

  if (!result.insertedId) {
    throw new AppError(
      ERROR_MESSAGES.USER.CREATE_FAILED,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  const { password: _, ...userWithoutPassword } = {
    _id: result.insertedId.toString(),
    ...newUser,
  };

  return userWithoutPassword;
}

export async function login(loginData: UserLoginInput) {
  const db = getDb();
  const usersCollection = db.collection<UserDocument>('users');

  const user = await usersCollection.findOne({ email: loginData.email });
  if (!user) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  const isPasswordValid = await bcrypt.compare(
    loginData.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError(
      ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

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

  const { password: _, ...userWithoutPassword } = user;
  return {
    token,
    user: {
      ...userWithoutPassword,
      _id: userId,
    },
  };
}

export async function logout(userId: string) {
  const db = getDb();
  const usersCollection = db.collection<UserDocument>('users');

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

  return { message: 'Đăng xuất thành công' };
}
