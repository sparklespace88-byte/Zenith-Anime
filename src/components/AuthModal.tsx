import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    register,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep modal mode in sync
  React.useEffect(() => {
    setMode(authModalMode);
    setFormError('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setFormError('Please enter your email (or username) and password.');
        return;
      }
      setIsSubmitting(true);
      const result = await login(email, password);
      setIsSubmitting(false);

      if (result === 'ok') {
        setPassword('');
        return;
      }
      if (result === 'not_found') {
        // No such account: send the user to Register with the email already filled in.
        setMode('register');
        setConfirmPassword('');
        setFormError('No account found with this email. Please create one to continue.');
      } else if (result === 'bad_password') {
        setFormError('Incorrect password. Please try again.');
      } else if (result === 'blocked') {
        setFormError('This account has been suspended by an administrator.');
      } else {
        setFormError('Something went wrong while signing in. Please try again.');
      }
    } else {
      if (!name.trim() || !username.trim() || !email.trim() || !password) {
        setFormError('All fields are required.');
        return;
      }
      if (!EMAIL_PATTERN.test(email.trim())) {
        setFormError('Please enter a valid email address (e.g. name@gmail.com).');
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
        setFormError('Username must be 3-20 characters: letters, numbers or underscore.');
        return;
      }
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      setIsSubmitting(true);
      const success = await register(name, username, email, password);
      setIsSubmitting(false);
      if (success) {
        setPassword('');
        setConfirmPassword('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e111a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white font-display">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-neutral-400">
            {mode === 'login'
              ? 'Access your custom anime watchlist and episode history'
              : 'Join the premier anime streaming community today'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#141824] p-1 border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setFormError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setFormError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {formError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {formError}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ken Kaneki"
                    className="w-full bg-[#131622] text-neutral-200 pl-9 pr-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
                  />
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. kaneki_ghoul"
                    className="w-full bg-[#131622] text-neutral-200 pl-9 pr-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
                  />
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              {mode === 'login' ? 'Email or Username' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-[#131622] text-neutral-200 pl-9 pr-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-neutral-300">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Password Reset', 'Password recovery instructions sent to your email.', 'info')}
                  className="text-[11px] text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#131622] text-neutral-200 pl-9 pr-10 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#131622] text-neutral-200 pl-9 pr-3 py-2 rounded-lg text-xs border border-white/10 focus:outline-none focus:border-purple-500"
                />
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#131622] border-white/10 text-purple-600 focus:ring-0"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In to ZenithAnime' : 'Complete Registration'}
          </button>
        </form>

      </div>
    </div>
  );
};
