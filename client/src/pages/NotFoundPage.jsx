import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Floating books animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl inline-block"
          >
            📚
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="text-5xl inline-block absolute -right-4 top-4"
          >
            📖
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="text-4xl inline-block absolute -left-4 top-6"
          >
            🔍
          </motion.div>
        </div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-9xl font-black gradient-text mb-2 leading-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
          <p className="text-gray-400 mb-2">
            Looks like this page got lost in the stacks!
          </p>
          <p className="text-gray-500 text-sm mb-10">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/books" className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium">
            <Search className="w-4 h-4" /> Browse Books
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex items-center justify-center gap-6 text-xs text-gray-600"
        >
          <Link to="/categories" className="hover:text-purple-400 transition-colors">Categories</Link>
          <span>·</span>
          <Link to="/authors" className="hover:text-purple-400 transition-colors">Authors</Link>
          <span>·</span>
          <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
          <span>·</span>
          <Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}