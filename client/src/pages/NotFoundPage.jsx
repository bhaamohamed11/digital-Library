import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl mb-6">📚</div>
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Looks like this page got lost in the stacks! Let's get you back to the library.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/books" className="btn-secondary flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Browse Books
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
