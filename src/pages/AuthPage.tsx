import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Layout';
import { Music, Mail, Lock, User, Github } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        if (data.name) {
          await updateProfile(userCred.user, { displayName: data.name });
        }
        navigate('/onboarding');
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setError(null);
    setSuccess(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if profile exists in Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', result.user.uid)
        .single();
      
      if (profile) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (e: any) {
      if (e.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        setError(`Unauthorized Domain (${domain}): Please add this domain to your Firebase Console under Auth > Settings > Authorized Domains.`);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Music className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold">Clemtrix Play</span>
          </Link>
          <h1 className="text-3xl font-bold">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === 'login' ? 'Start where you left off' : 'Start your musical journey today'}
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100 italic">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <User className="w-4 h-4 mr-2" /> Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium flex items-center">
                  <Lock className="w-4 h-4 mr-2" /> Password
                </label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                {...register('password')}
                type="password"
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-gray-800 dark:border-gray-700"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              {mode === 'login' ? 'Log in' : 'Sign up'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="Google" />
            Google
          </Button>
        </Card>

        <p className="text-center mt-8 text-sm text-gray-500">
          {mode === 'login' ? (
            <>Don't have an account? <Link to="/auth/signup" className="text-indigo-600 font-bold">Sign up</Link></>
          ) : (
            <>Already have an account? <Link to="/auth/login" className="text-indigo-600 font-bold">Log in</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
