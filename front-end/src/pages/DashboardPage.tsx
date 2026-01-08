import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutThunk } from '@/store/auth/auth.thunks';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GroupList } from '@/features/groups/components/GroupList';
import { CreateGroupDialog } from '@/features/groups/components/CreateGroupDialog';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Splitwise Clone
            </h1>
            <p className="text-slate-400 mt-2">
              Xin chào, {user?.username || 'Bạn'}!
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="hover:bg-red-600"
          >
            Đăng xuất
          </Button>
        </header>

        <main className="grid grid-cols-1 gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Nhóm của bạn</h2>
            <Button
              onClick={() => setIsCreateGroupOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
            </Button>
          </div>

          <GroupList />

          <CreateGroupDialog
            isOpen={isCreateGroupOpen}
            onClose={() => setIsCreateGroupOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}
