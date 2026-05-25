import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import useStore from '../stores/useStore';
import BookCard from '../components/BookCard';
import { Skeleton } from '../components/Skeleton';

const CATEGORY_ICONS = {
  'Fiction': '📖',
  'Science': '🔬',
  'History': '🏛️',
  'Technology': '💻',
  'Philosophy': '🧠',
  'Art': '🎨',
};

const STATS = [
  { icon: BookOpen, value: '500+', label: 'Books Available', color: 'from-purple-500 to-indigo-500' },
  { icon: Users, value: '10K+', label: 'Active Readers', color: 'from-cyan-500 to-blue-500' },
  { icon: Star, value: '4.8', label: 'Average Rating', color: 'from-amber-500 to-orange-500' },
  { icon: TrendingUp, value: '50+', label: 'New Books Daily', color: 'from-pink-500 to-rose-500' },
];

export default function HomePage() {
  const { featuredBooks, fetchFeatured, categories, fetchCategories, loading } = useStore();

  useEffect(() => {
    fetchFeatured();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#0A0F1E] to-indigo-950/50" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        {/* Floating Books */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                top: `${15 + i * 13}%`,
                left: i % 2 === 0 ? `${5 + i * 3}%` : `${80 - i * 2}%`,
                opacity: 0.15,
              }}
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            >
              📚
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
           
         
         

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Discover a World of
              <span className="block gradient-text">Knowledge & Creativity</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Thousands of books and novels at your fingertips. Read, enjoy, and save your favorites to your personal library.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/books" className="btn-primary text-lg flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                Browse Books
              </Link>
              <Link to="/register" className="btn-secondary text-lg flex items-center justify-center gap-2">
                Join for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

     
 
          
        
    
     
  
  
    </div>
  );
}





    





