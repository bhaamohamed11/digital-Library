import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, User, BookOpen } from 'lucide-react';
import api from '../api/axios';

const GRADIENTS = [
  'from-purple-600 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-orange-500 to-red-500',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
];

export default function AuthorsPage() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const { data } = await api.get('/books/authors/all');
      setAuthors(data);
      setFiltered(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setFiltered(authors); return; }
    setFiltered(authors.filter(a => a._id.toLowerCase().includes(val.toLowerCase())));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">✍️ Authors</h1>
          <p className="text-gray-400">Explore books by your favorite authors</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search authors..."
            className="w-full bg-gray-800/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {/* Authors Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No authors found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((author, i) => (
              <motion.div key={author._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => navigate(`/books?search=${encodeURIComponent(author._id)}`)}
                  className="group w-full text-left"
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} p-6 hover:scale-[1.02] transition-all duration-300`}>
                    {/* Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl" />
                    </div>

                    <div className="relative">
                      {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                      <span className="text-4xl">👤</span>
                    </div>

                      {/* Name */}
                      <h3 className="text-lg font-black text-white mb-1 line-clamp-1 group-hover:text-white/90">
                        {author._id}
                      </h3>

                      {/* Category */}
                      <p className="text-white/60 text-xs mb-3">{author.category}</p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                          <BookOpen className="w-4 h-4" />
                          <span>{author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}</span>
                        </div>
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium group-hover:bg-white/30 transition-colors">
                          Browse →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}