import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import useStore from '../stores/useStore';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/Skeleton';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'downloads', label: 'Most Read' },
  { value: 'title', label: 'A–Z' },
];

export default function BooksPage() {
  const [params, setParams] = useSearchParams();
  const { 
    books, 
    totalBooks, 
    totalPages, 
    filters, 
    fetchBooks, 
    categories, 
    loading,
    fetchFeatured 
  } = useStore();

  const currentPage = parseInt(filters.page) || 1;
  const currentCat = params.get('category') || filters.category || 'all';
  const currentSearch = params.get('search') || filters.search || '';
  const currentSort = filters.sort || 'newest';

  const load = useCallback(() => {
    fetchBooks({
      search: currentSearch,
      category: currentCat,
      sort: currentSort,
      page: currentPage,
      // نؤكد على أننا نريد فقط الكتب المنشورة
    });
  }, [currentSearch, currentCat, currentSort, currentPage, fetchBooks]);

  useEffect(() => {
    load();
  }, [load]);

  // Load featured books (only published)
  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  const updateFilter = (key, val) => {
    fetchBooks({ 
      [key]: val, 
      page: 1 
    });
    
    if (key === 'category') {
      if (val === 'all') {
        setParams({});
      } else {
        setParams({ category: val });
      }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">📚 Book Catalog</h1>
          <p className="text-gray-400">{totalBooks} published books available</p>
        </div>

        {/* Filters Bar */}
        <div className="glass p-4 rounded-2xl mb-8 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              defaultValue={currentSearch}
              placeholder="Search books or authors..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateFilter('search', e.target.value);
              }}
            />
          </div>

          {/* Category */}
          <select
            value={currentCat}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-gray-800/60 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.icon || ''} {c.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="bg-gray-800/60 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 ml-auto text-xs text-gray-500">
            <SlidersHorizontal className="w-3 h-3" /> Filters
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {books.map((book, i) => (
              <BookCard key={book._id} book={book} index={i} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => fetchBooks({ page: i + 1 })}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}