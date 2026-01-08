import { fetchApi } from './api.service';
import type { Group } from '@/types/group.types';

export const groupsService = {
  async getGroups(): Promise<Group[]> {
    return fetchApi<Group[]>('/groups');
  },

  async createGroup(name: string, description?: string): Promise<Group> {
    return fetchApi<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  async getGroupDetails(id: string): Promise<Group> {
    return fetchApi<Group>(`/groups/${id}`);
  },
};
