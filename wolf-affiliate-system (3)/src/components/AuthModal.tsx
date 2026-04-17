import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    needsVerification, 
    setNeedsVerification, 
    verificationEmail, 
    setVerificationEmail 
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect happens automatically via AuthContext listener
    } catch (err: any) {
      console.error('Google Auth error:', err);
      // Handle the case where provider might still be disabled in console
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console.');
      } else {
        setError(err.message || 'An error occurred during Google authentication.');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        closeAuthModal();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: name
          });
          
          await sendEmailVerification(userCredential.user);
          setVerificationEmail(email);
          setNeedsVerification(true);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setNeedsVerification(false);
    setIsLogin(true);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 rounded-[40px] p-8 md:p-12 soft-shadow border border-white/5 overflow-hidden"
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 space-y-8">
              {needsVerification ? (
                <div className="text-center space-y-8 py-4">
                  <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center text-red-600 mx-auto">
                    <Mail size={40} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                      Verify Your Email
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      We have sent you a verification email to <span className="font-bold text-white">{verificationEmail}</span>. Please verify it and log in.
                    </p>
                  </div>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-5 bg-white text-zinc-900 rounded-full font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 soft-shadow"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-xl italic font-black text-sm tracking-tighter mb-4 soft-shadow">
                      WOLF
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                      {isLogin ? 'Welcome Back' : 'Join the Pack'}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      {isLogin ? 'Enter your credentials to access your den.' : 'Create an account to start leading the pack.'}
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 flex items-start gap-3 text-red-500 text-xs"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-red-600 transition-colors text-white"
                            placeholder="John Wolf"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-red-600 transition-colors text-white"
                          placeholder="alpha@wolf.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-zinc-800 border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-red-600 transition-colors text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed soft-shadow"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        isLogin ? 'Login' : 'Register'
                      )}
                    </button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                        <span className="bg-zinc-900 px-4 text-zinc-500">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full py-5 bg-zinc-800 text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed soft-shadow"
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
                      Google
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors"
                    >
                      {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
