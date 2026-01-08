import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getGroupsThunk } from '@/store/groups/groups.thunks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function GroupList() {
  const dispatch = useAppDispatch();
  const {
    list: groups,
    isLoading,
    error,
  } = useAppSelector(state => state.groups);

  useEffect(() => {
    dispatch(getGroupsThunk());
  }, [dispatch]);

  if (isLoading && groups.length === 0) {
    return <div className="text-slate-400">Đang tải danh sách nhóm...</div>;
  }

  if (error) {
    return <div className="text-red-400">Lỗi: {error}</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
        <Users className="mx-auto h-12 w-12 text-slate-500 mb-3" />
        <p className="text-slate-400">Bạn chưa tham gia nhóm nào.</p>
        <p className="text-slate-500 text-sm mt-1">
          Hãy tạo nhóm mới để bắt đầu!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {groups.map(group => (
        <Card
          key={group._id}
          className="bg-slate-800 border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer group"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {group.name}
            </CardTitle>
            <CardDescription className="text-slate-400 line-clamp-1">
              {group.description || 'Không có mô tả'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-slate-500">
              <Users className="mr-2 h-4 w-4" />
              <span className="mr-4">{group.members.length} thành viên</span>

              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(new Date(group.createdAt), 'dd/MM/yyyy')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
