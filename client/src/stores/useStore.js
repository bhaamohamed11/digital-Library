import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set, get) => ({
  // Auth state
  user: JSON.parse(localStorage.getItem('library_user') || 'null'),
  loading: false,
  error: null,

  // Books
  books: [],
  featuredBooks: [],
  categories: [],
  currentBook: null,
  totalBooks: 0,
  totalPages: 0,

  // Filters
  filters: { search: '', category: 'all', sort: 'newest', page: 1 },

  // UI
  favorites: [],

  // Cart
  cart: JSON.parse(localStorage.getItem(`library_cart_${JSON.parse(localStorage.getItem('library_user') || 'null')?._id}`) || '[]'),

  // Auth actions
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('library_user', JSON.stringify(data));
      const userCart = JSON.parse(localStorage.getItem(`library_cart_${data._id}`) || '[]');
      set({ user: data, loading: false, favorites: data.favorites || [], cart: userCart });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed. Please check your credentials.', loading: false });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('library_user', JSON.stringify(data));
      set({ user: data, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed. Please try again.', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('library_user');
    set({ user: null, favorites: [], cart: [] });
  },

  clearError: () => set({ error: null }),

  // Books actions
  fetchBooks: async (filters = {}) => {
    set({ loading: true });
    try {
      const params = { ...get().filters, ...filters };
      set({ filters: params });
      const { data } = await api.get('/books', { params });
      set({ books: data.books, totalBooks: data.total, totalPages: data.pages, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  fetchFeatured: async () => {
    try {
      const { data } = await api.get('/books/featured');
      set({ featuredBooks: data });
    } catch (err) { console.error(err); }
  },

  fetchBook: async (id) => {
    set({ loading: true, currentBook: null });
    try {
      const { data } = await api.get(`/books/${id}`);
      set({ currentBook: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await api.get('/categories');
      set({ categories: data });
    } catch (err) { console.error(err); }
  },

  // Cart actions
  addToCart: (book) => {
    const { cart, user } = get();
    const exists = cart.find(item => item._id === book._id);
    if (exists) return false;
    const newCart = [...cart, book];
    localStorage.setItem(`library_cart_${user?._id}`, JSON.stringify(newCart));
    set({ cart: newCart });
    return true;
  },

  removeFromCart: (bookId) => {
    const { cart, user } = get();
    const newCart = cart.filter(item => item._id !== bookId);
    localStorage.setItem(`library_cart_${user?._id}`, JSON.stringify(newCart));
    set({ cart: newCart });
  },

  clearCart: () => {
    const { user } = get();
    localStorage.removeItem(`library_cart_${user?._id}`);
    set({ cart: [] });
  },

  isInCart: (bookId) => {
    return get().cart.some(item => item._id === bookId);
  },

  // Favorites
  toggleFavorite: async (bookId) => {
    const { user } = get();
    if (!user) return false;
    try {
      const { data } = await api.put(`/users/favorites/${bookId}`);
      const updatedUser = { ...user, favorites: data.favorites };
      localStorage.setItem('library_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, favorites: data.favorites });
      return true;
    } catch (err) { return false; }
  },

  isFavorite: (bookId) => {
    const { user } = get();
    return user?.favorites?.includes(bookId) || false;
  },

  // Profile
  fetchProfile: async () => {
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (err) { return null; }
  },
}));

export default useStore;