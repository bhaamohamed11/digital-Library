import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../stores/useStore';

const ICONS = { Fiction: '📖', Science: '🔬', History: '🏛️', Technology: '💻', Philosophy: '🧠', Art: '🎨' };
const GRADIENTS = {
  Fiction: 'from-purple-600 to-indigo-600',
  Science: 'from-cyan-500 to-blue-600',
  History: 'from-amber-500 to-orange-600',
  Technology: 'from-emerald-500 to-teal-600',
  Philosophy: 'from-rose-500 to-pink-600',
  Art: 'from-orange-500 to-red-500',
};

export default function CategoriesPage() {
  const { categories, fetchCategories } = useStore();

  useEffect(() => { fetchCategories(); }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">🗂 Browse Categories</h1>
          <p className="text-gray-400">Find your next great read by topic or genre</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                to={`/books?category=${encodeURIComponent(cat.name)}`}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${GRADIENTS[cat.name] || 'from-gray-700 to-gray-600'} p-8 hover:scale-[1.02] transition-all duration-300`}>
                  {/* glow blob */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                  </div>
                  <div className="relative">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                      {ICONS[cat.name] || '📘'}
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">{cat.name}</h2>
                    <p className="text-white/70 text-sm mb-3">{cat.description || 'Explore this collection'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{cat.bookCount || 0} books</span>
                      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium group-hover:bg-white/30 transition-colors">
                        Browse →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
