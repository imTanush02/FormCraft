
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { fadeUp, staggerContainer, staggerItem } from '../utils/animationVariants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 items-center justify-center p-12">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-md text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-8">
            <i className="ri-quill-pen-line text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">FormCraft</h1>
          <p className="text-brand-200 text-lg leading-relaxed">
            Build beautiful, dynamic forms with zero code. Drag, customize, and collect responses effortlessly.
          </p>
        </motion.div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-950">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={staggerItem} className="mb-8">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-quill-pen-line text-xl text-brand-400"></i>
              </div>
              <span className="text-xl font-display font-bold text-white">FormCraft</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Welcome back</h2>
            <p className="text-surface-400 mt-1">Sign in to manage your forms</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={staggerItem}>
              <label htmlFor="login-email" className="block text-sm font-medium text-surface-300 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
                aria-required="true"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label htmlFor="login-password" className="block text-sm font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-required="true"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    Signing in...
                  </motion.span>
                ) : (
                  <>
                    <i className="ri-login-box-line"></i>
                    Sign In
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p variants={staggerItem} className="mt-6 text-center text-surface-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
