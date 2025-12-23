import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/auth.schema';
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
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/auth/auth.thunks';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess?: () => void;
}

export function LoginForm({
  onSwitchToRegister,
  onLoginSuccess,
}: LoginFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await dispatch(loginThunk(data)).unwrap();
      toast({
        title: 'Đăng nhập thành công',
        description: `Chào mừng bạn trở lại, ${result.user.username}!`,
      });

      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Email hoặc mật khẩu không đúng';
      toast({
        title: 'Đăng nhập thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-white">
          Đăng nhập
        </CardTitle>
        <CardDescription className="text-white/70">
          Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          <div className="text-center text-sm text-white/70">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-white font-semibold hover:underline"
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
