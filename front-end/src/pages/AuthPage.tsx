import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { ThreeScene } from '@/features/auth/components/ThreeScene';

const FLOATING_PARTICLES = Array.from({ length: 50 }).map((_, index) => ({
  id: index,
  initialX: Math.random() * window.innerWidth,
  initialY: Math.random() * window.innerHeight,
  initialOpacity: Math.random() * 0.5 + 0.2,
  targetY: Math.random() * window.innerHeight,
  targetX: Math.random() * window.innerWidth,
  targetOpacity: Math.random() * 0.5 + 0.2,
  duration: Math.random() * 10 + 10,
}));

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-amber-900"
          animate={{
            background: [
              'linear-gradient(to bottom right, #0f172a, #581c87, #064e3b, #78350f)',
              'linear-gradient(to bottom right, #1e293b, #6b21a8, #065f46, #92400e)',
              'linear-gradient(to bottom right, #0f172a, #581c87, #064e3b, #78350f)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Animated Mesh Gradient Overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 165, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {FLOATING_PARTICLES.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                opacity: particle.initialOpacity,
              }}
              animate={{
                y: [null, particle.targetY],
                x: [null, particle.targetX],
                opacity: [null, particle.targetOpacity],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Scene - Left Side (Desktop) */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <div className="absolute inset-0">
          <ThreeScene />
        </div>
      </div>

      {/* Auth Form - Right Side (Desktop) / Full Screen (Mobile) */}
      <div className="flex w-full lg:w-[40%] items-center justify-center p-4 lg:p-8 relative z-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
