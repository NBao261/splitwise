import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { createGroupThunk } from '@/store/groups/groups.thunks';
import { SimpleDialog } from '@/components/ui/simple-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const createGroupSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().optional(),
});

type CreateGroupInput = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupDialog({ isOpen, onClose }: CreateGroupDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
  });

  const onSubmit = async (data: CreateGroupInput) => {
    setIsSubmitting(true);
    try {
      await dispatch(createGroupThunk(data)).unwrap();
      toast({
        title: 'Tạo nhóm thành công',
        description: `Nhóm "${data.name}" đã được tạo.`,
      });
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Tạo nhóm thất bại',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SimpleDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo nhóm mới"
      description="Tạo nhóm để bắt đầu chia sẻ chi phí với bạn bè."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Tên nhóm
          </Label>
          <Input
            id="name"
            placeholder="Ví dụ: Chuyến đi Đà Lạt, Tiền nhà..."
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Mô tả (Tùy chọn)
          </Label>
          <Input
            id="description"
            placeholder="Mô tả ngắn về nhóm này"
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            {...register('description')}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo nhóm'
            )}
          </Button>
        </div>
      </form>
    </SimpleDialog>
  );
}
