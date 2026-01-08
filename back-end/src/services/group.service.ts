import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db';
import { CreateGroupInput, GroupDocument } from '../models/group.model';
import { UserDocument } from '../models/user.model';
import { AppError } from '../utils';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';

export async function createGroup(userId: string, groupData: CreateGroupInput) {
  const db = getDb();
  const groupsCollection = db.collection<GroupDocument>('groups');

  const newGroup: GroupDocument = {
    name: groupData.name,
    description: groupData.description,
    ownerId: new ObjectId(userId),
    members: [new ObjectId(userId)], // Owner is automatically a member
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await groupsCollection.insertOne(newGroup);

  if (!result.insertedId) {
    throw new AppError('Không thể tạo nhóm', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return {
    ...newGroup,
    _id: result.insertedId,
  };
}

export async function getUserGroups(userId: string) {
  const db = getDb();
  const groupsCollection = db.collection<GroupDocument>('groups');

  const userObjectId = new ObjectId(userId);

  const groups = await groupsCollection
    .find({
      members: userObjectId,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return groups;
}

export async function getGroupDetails(groupId: string, userId: string) {
  const db = getDb();
  const groupsCollection = db.collection<GroupDocument>('groups');
  const usersCollection = db.collection<UserDocument>('users');

  const groupObjectId = new ObjectId(groupId);
  const userObjectId = new ObjectId(userId);

  const group = await groupsCollection.findOne({ _id: groupObjectId });

  if (!group) {
    throw new AppError(ERROR_MESSAGES.GROUP.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Check if user is a member
  const isMember = group.members.some(
    memberId => memberId.toString() === userId
  );

  if (!isMember) {
    throw new AppError(
      ERROR_MESSAGES.SERVER.UNAUTHORIZED,
      HTTP_STATUS.FORBIDDEN
    );
  }

  // Fetch member details
  const members = await usersCollection
    .find(
      { _id: { $in: group.members.map(id => new ObjectId(id)) } },
      { projection: { password: 0 } } // Exclude password
    )
    .toArray();

  return {
    ...group,
    members,
  };
}
