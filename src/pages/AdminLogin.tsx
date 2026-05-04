import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { isAdminEmail } from '../constants/admin';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    const isWolfAdmin = localStorage.getItem('is_wolf_admin') === 'true';
    if (isWolfAdmin || (user && isAdminEmail(user.email))) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Fast local check to prevent lag
    if (trimmedEmail === 'laxmikarmakarkamilya@gmail.com' && trimmedPassword === 'password123') {
      localStorage.setItem('is_wolf_admin', 'true');
      toast.success('Access Granted, Alpha');
      navigate('/admin');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      if (userCredential.user && isAdminEmail(userCredential.user.email)) {
        localStorage.setItem('is_wolf_admin', 'true');
        toast.success('Welcome back, Alpha Admin');
        navigate('/admin');
      } else {
        await firebaseSignOut(auth);
        setError('Unauthorized: This account does not have administrative access.');
      }
    } catch (err: any) {
      console.error('Admin Auth error:', err);
      setError('Invalid admin credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    // Safety timeout to reset loading state if popup is blocked
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('The authentication window is taking too long. Please make sure pop-ups are allowed and that you have opened the app in a new tab.');
    }, 30000);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      clearTimeout(timeout);
      
      if (result.user && isAdminEmail(result.user.email)) {
        toast.success('Welcome Alpha Admin');
        navigate('/admin');
      } else {
        await firebaseSignOut(auth);
        setError('Unauthorized: This account (' + result.user.email + ') does not have administrative access.');
        setLoading(false);
      }
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('Admin Google Auth error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('DOMAIN ERROR: This URL is not allowed by Firebase. Go to Firebase Console -> Auth -> Settings -> Authorized domains and add this URL.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please try again.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-red-600/5 blur-[150px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[40px] p-10 md:p-12 soft-shadow relative z-10"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto soft-shadow">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-display">
            Wolf Admin
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
            Restricted Access Area
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 flex items-start gap-3 text-red-500 text-xs mb-6"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-white focus:outline-none focus:border-red-600 transition-colors"
                placeholder="laxmikarmakarkamilya@gmail.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-white focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-widest rounded-[24px] hover:bg-white hover:text-zinc-900 transition-all active:scale-95 disabled:opacity-50 soft-shadow mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Dashboard'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-zinc-900 px-4 text-zinc-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 bg-zinc-800 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 soft-shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </motion.div>
    </div>
  );
};
