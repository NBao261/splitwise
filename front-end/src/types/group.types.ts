export interface Group {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[] | Record<string, unknown>[]; // Record for when member details are populated
  createdAt: string;
  updatedAt: string;
}
