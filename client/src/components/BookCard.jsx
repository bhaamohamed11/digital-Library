import { Link } from 'react-router-dom';
import { Heart, Star, BookOpen, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../stores/useStore';
import toast from 'react-hot-toast';

export default function BookCard({ book, index = 0 }) {
  const { toggleFavorite, isFavorite, user } = useStore();
  const fav = isFavorite(book._id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Sign in to add favorites'); return; }
    const ok = await toggleFavorite(book._id);
    if (ok) toast.success(fav ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/books/${book._id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-transparent scale-90">
          {/* Cover */}
          <div className="relative overflow-hidden aspect-[3/4] bg-gray-800">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/200x280/1a1a2e/7C3AED?text=${encodeURIComponent(book.title.slice(0, 8))}`;
              }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span className="flex items-center gap-2 bg-purple-600 text-white text-xs px-4 py-2 rounded-full shadow-lg">
                <Eye className="w-3 h-3" /> View Book
              </span>
            </div>
            {/* Featured Badge */}
            {book.featured && (
              <div className="absolute top-2 left-2">
                <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>
              </div>
            )}

           {/* Favorite */}
           {(!user || user.role !== 'admin') && (
            <button onClick={handleFavorite}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${fav ? 'bg-pink-500 shadow-lg shadow-pink-500/50' : 'bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100'}`}
              >
                <Heart className={`w-4 h-4 ${fav ? 'text-white fill-white' : 'text-white'}`} />
                </button>
           )}
          </div>

          {/* Info */}
          <div className="pt-3 px-1">
            <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors mb-1">
              {book.title}
            </h3>
            <p className="text-xs text-gray-400 mb-2">{book.author}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-amber-400 font-medium">{Number(book.rating).toFixed(1)}</span>
                <span className="text-xs text-gray-600">({book.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <BookOpen className="w-3 h-3" />
                <span className="text-xs">{book.pages} pp</span>
              </div>
            </div>
           <div className="mt-2 flex items-center justify-between">
  <span className="tag text-xs">{book.category}</span>
  {book.isFree ? (
    <span className="text-xs font-bold text-green-400">Free</span>
  ) : (
    <span className="text-xs font-bold text-purple-400">${book.price || 0}</span>
  )}
</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
