import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// ✅ Use shared icons from SocialIcons.js
import { GoogleIcon, TwitterIcon } from '@/components/SocialIcons';

// --- THE INTERACTIVE EYE COMPONENT ---
const KrazyEye = ({ focusedInput }) => {
  const eyeRef = useRef(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      if (!eyeRef.current || typeof window === 'undefined') return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      let targetX, targetY;

      if (focusedInput === 'password') {
        // Look down/closed (Simulate hiding)
        targetX = eyeCenterX;
        targetY = eyeCenterY + 150;
      } else if (focusedInput === 'email') {
        // Look at the form (left side of screen)
        targetX = rect.left - 400;
        targetY = eyeCenterY;
      } else {
        // Look at Mouse
        targetX = e.clientX;
        targetY = e.clientY;
      }

      const angle = Math.atan2(targetY - eyeCenterY, targetX - eyeCenterX);
      const distance = Math.min(
        55,
        Math.hypot(targetX - eyeCenterX, targetY - eyeCenterY) / 4
      );

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      setPupilPos({ x: pupilX, y: pupilY });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMove);
      return () => window.removeEventListener('mousemove', handleMove);
    }
  }, [focusedInput]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-96 h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-[60px] animate-pulse"></div>

        <div
          ref={eyeRef}
          className="relative w-80 h-80 rounded-full flex items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-2xl"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #ffffff, #e5e5e5, #d4d4d4)',
            boxShadow:
              'inset -10px -10px 40px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Iris */}
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center relative transition-transform duration-75 ease-out shadow-lg"
            style={{
              transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
              background:
                'radial-gradient(circle, #facc15 0%, #ca8a04 90%, #854d0e 100%)',
              border: '2px solid #854d0e',
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                backgroundImage:
                  'repeating-conic-gradient(#a16207 0% 1%, transparent 1% 5%)',
              }}
            ></div>
            <div className="w-20 h-20 bg-black rounded-full relative shadow-inner">
              <div className="absolute top-4 right-5 w-6 h-4 bg-white rounded-full opacity-90 rotate-45 blur-[1px]"></div>
              <div className="absolute bottom-4 left-5 w-2 h-2 bg-white rounded-full opacity-40 blur-[2px]"></div>
            </div>
          </div>

          <div
            className={`absolute inset-0 bg-neutral-900 transition-all duration-300 ease-in-out z-20 ${
              focusedInput === 'password' ? 'translate-y-0' : '-translate-y-full'
            }`}
            style={{ borderBottom: '8px solid #171717' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      if (typeof window !== 'undefined') {
        const name = formData.fullName || 'Test User';
        localStorage.setItem(
          'user',
          JSON.stringify({ name: name, email: formData.email })
        );
      }
      router.push('/dashboard');
    } else {
      setError('Please fill in email and password.');
    }
  };

  const handleForgotPassword = () => {
    alert(
      'This feature is currently disabled in the prototype. A reset link would be sent to your email.'
    );
  };

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white overflow-hidden">
      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-20 relative z-10 bg-neutral-950/80 backdrop-blur-sm">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-neutral-500 hover:text-white transition"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Home
        </Link>

        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">
            {isLogin ? 'Welcome Back!' : 'Join the Chaos.'}
          </h1>
          <p className="text-neutral-400 mb-8">
            {isLogin
              ? 'Enter your details to access your dashboard.'
              : 'Start automating your social supply chain today.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="John Doe"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="you@example.com"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors pr-10"
                  placeholder="••••••••"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-neutral-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isLogin && (
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-neutral-500 hover:text-yellow-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-900 font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-yellow-400/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? isLogin
                  ? 'Signing In...'
                  : 'Creating Account...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-neutral-800"></div>
            <span className="px-4 text-neutral-500 text-xs font-bold uppercase">
              Or continue with
            </span>
            <div className="flex-1 border-t border-neutral-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold py-3 rounded-xl transition">
              <GoogleIcon className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold py-3 rounded-xl transition">
              <TwitterIcon className="w-5 h-5" />
              <span>X / Twitter</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-neutral-500">
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ fullName: '', email: '', password: '' });
              }}
              className="text-yellow-400 hover:underline font-bold"
            >
              {isLogin ? 'Create an account' : 'Log In'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE MONSTER EYE */}
      <div className="hidden lg:flex w-1/2 bg-neutral-900 relative items-center justify-center overflow-hidden border-l border-neutral-800">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>

        <div className="relative z-10 flex flex-col items-center">
          <KrazyEye focusedInput={focusedInput} />

          <div className="mt-16 text-center opacity-50">
            <p className="text-xl font-black text-neutral-700 tracking-[0.5em] uppercase">
              Krazy Notesy
            </p>
            <p className="text-xs text-neutral-600 mt-2">
              I see what you are typing...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
