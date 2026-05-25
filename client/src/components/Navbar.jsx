import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, Heart, User, LogOut, Menu, X, ChevronDown, Settings, ShoppingCart, ShoppingBag, TrendingUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../stores/useStore';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout, fetchCategories, categories, cart } = useStore();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenu(false);
  }, [location]);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    // Debounce — ينتظر 300ms بعد ما المستخدم يوقف الكتابة
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get('/books', { params: { search: val, limit: 6 } });
        setSuggestions(data.books || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur-xl shadow-2xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">MyLibrary</span>
          </Link>

          {/* Smart Search */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                {searching ? (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by title or author..."
                  className="w-full bg-gray-800/70 border border-white/10 rounded-xl py-2.5 pl-11 pr-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
                {search && (
                  <button type="button" onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 w-full bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  {suggestions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No books found for "{search}"
                    </div>
                  ) : (
                    <>
                      <div className="p-2">
                        {suggestions.map((book) => (
                          <button key={book._id}
                            onMouseDown={() => { navigate(`/books/${book._id}`); setShowSuggestions(false); setSearch(''); }}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group"
                          >
                            {/* Cover */}
                            <img src={book.cover} alt={book.title}
                              className="w-10 h-14 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/40x56?text=📖'} />

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                                {book.title}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{book.author}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="tag text-xs py-0">{book.category}</span>
                                {book.rating > 0 && (
                                  <span className="flex items-center gap-0.5 text-xs text-amber-400">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {Number(book.rating).toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="shrink-0 text-right">
                              {book.isFree ? (
                                <span className="text-xs font-bold text-green-400">Free</span>
                              ) : (
                                <span className="text-sm font-bold text-purple-400">${book.price || 0}</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* View All */}
                      <div className="border-t border-white/10 p-2">
                        <button
                          onMouseDown={() => { navigate(`/books?search=${encodeURIComponent(search)}`); setShowSuggestions(false); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-purple-400 hover:bg-purple-500/10 transition-colors font-medium">
                          <Search className="w-4 h-4" />
                          View all results for "{search}"
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
           {[
  { to: '/books', label: 'Books' },
  { to: '/categories', label: 'Categories' },
  { to: '/authors', label: 'Authors' },
  { to: '/contact', label: 'Contact' },
].map((link) => (
  <Link key={link.to} to={link.to}
    className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
      location.pathname === link.to
        ? 'text-white bg-white/5'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`}>
    {link.label}
  </Link>
))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-300 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 transition-all">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-purple-600 flex items-center justify-center">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm text-white hidden sm:block max-w-20 truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <Link to="/dashboard" className="flex items-center gap-2 p-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors">
                        <Heart className="w-4 h-4 text-pink-400" /> Dashboard
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 p-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors border-t border-white/5">
                        <ShoppingBag className="w-4 h-4 text-purple-400" /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/stats" className="flex items-center gap-2 p-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors border-t border-white/5">
                          <TrendingUp className="w-4 h-4 text-green-400" /> Dashboard Stats
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 p-3 hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors border-t border-white/5">
                          <Settings className="w-4 h-4 text-amber-400" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className="w-full flex items-center gap-2 p-3 hover:bg-red-500/10 text-sm text-gray-300 hover:text-red-400 transition-colors border-t border-white/5">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all hidden sm:block">Sign In</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Join Free</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-300">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-gray-950/98 backdrop-blur-xl">
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link to="/books" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium transition-all">📚 Books</Link>
              <Link to="/categories" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium transition-all">🗂 Categories</Link>
              <Link to="/authors" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium transition-all">✍️ Authors</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium transition-all">📬 Contact</Link>
              <Link to="/about" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium transition-all">ℹ️ About Us</Link>
              {!user && <Link to="/login" className="text-gray-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 text-sm font-medium">Sign In</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}