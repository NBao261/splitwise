import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '../schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/store/hooks';
import { registerThunk } from '@/store/auth/auth.thunks';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      await dispatch(registerThunk(data)).unwrap();
      toast({
        title: 'Đăng ký thành công',
        description:
          'Tài khoản của bạn đã được tạo thành công! Vui lòng đăng nhập.',
      });

      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      toast({
        title: 'Đăng ký thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-white">Đăng ký</CardTitle>
        <CardDescription className="text-white/70">
          Tạo tài khoản mới để bắt đầu sử dụng Splitwise.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Tên người dùng
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-300">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đăng ký'
            )}
          </Button>

          <div className="text-center text-sm text-white/70">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-white font-semibold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
