import { createAsyncThunk } from '@reduxjs/toolkit';
import { groupsService } from '@/services/groups.service';
import { setGroups, addGroup, setLoading, setError } from './groups.slice';

export const getGroupsThunk = createAsyncThunk(
  'groups/getGroups',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const groups = await groupsService.getGroups();
      dispatch(setGroups(groups));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : 'Lỗi khi lấy danh sách nhóm'
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createGroupThunk = createAsyncThunk(
  'groups/createGroup',
  async (
    { name, description }: { name: string; description?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setLoading(true));
      const newGroup = await groupsService.createGroup(name, description);
      dispatch(addGroup(newGroup));
      return newGroup;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Lỗi khi tạo nhóm'
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
);
