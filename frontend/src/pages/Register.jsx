
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { fadeUp, listFadeIn, itemSlideUp } from '../utils/animationVariants';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to FormCraft');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Join thousands of creators building stunning forms without writing a single line of code.
          </p>
        </motion.div>
      </div>

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-950">
        <motion.div
          variants={listFadeIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemSlideUp} className="mb-8">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                <i className="ri-quill-pen-line text-xl text-brand-400"></i>
              </div>
              <span className="text-xl font-display font-bold text-white">FormCraft</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Create your account</h2>
            <p className="text-surface-400 mt-1">Start building amazing forms today</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemSlideUp}>
              <label htmlFor="reg-name" className="block text-sm font-medium text-surface-300 mb-1.5">
                Full name
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
                autoComplete="name"
                aria-required="true"
              />
            </motion.div>

            <motion.div variants={itemSlideUp}>
              <label htmlFor="reg-email" className="block text-sm font-medium text-surface-300 mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
                aria-required="true"
              />
            </motion.div>

            <motion.div variants={itemSlideUp}>
              <label htmlFor="reg-password" className="block text-sm font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                autoComplete="new-password"
                aria-required="true"
              />
            </motion.div>

            <motion.div variants={itemSlideUp}>
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
                    Creating account...
                  </motion.span>
                ) : (
                  <>
                    <i className="ri-user-add-line"></i>
                    Create Account
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemSlideUp} className="mt-6 text-center text-surface-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
