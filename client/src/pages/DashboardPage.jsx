import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, BookOpen, User, Clock, LogOut, Edit2, Save, X, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import useStore from '../stores/useStore';
import BookCard from '../components/BookCard';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'orders', label: 'My Books', icon: ShoppingBag },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function DashboardPage() {
  const { user, logout, fetchProfile, setUser } = useStore();
  const [tab, setTab] = useState('favorites');
  const [favBooks, setFavBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Edit Profile state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({ name: user.name || '', avatar: user.avatar || '' });
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [favRes, histRes, ordersRes] = await Promise.all([
        api.get('/users/favorites'),
        api.get('/users/history'),
        api.get('/orders/my-orders'),
      ]);
      setFavBooks(favRes.data || []);
      setHistory(histRes.data || []);
      setOrders(ordersRes.data || []);
    } catch { }
  };

  const handleSaveProfile = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { name: form.name, avatar: form.avatar });
      setUser({ ...user, name: data.name, avatar: data.avatar, token: data.token });
      toast.success('Profile updated! ✅');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!pwForm.newPw) { toast.error('Enter new password'); return; }
    if (pwForm.newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    setSavingPw(true);
    try {
      await api.put('/users/profile', { password: pwForm.newPw });
      toast.success('Password changed! 🔒');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 shrink-0">
            {user.avatar
              ? <img src={user.avatar} className="w-full h-full object-cover" alt="" onError={(e) => e.target.style.display = 'none'} />
              : <User className="w-8 h-8 text-white" />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{user.name}'s Library</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="ml-auto flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
              {t.id === 'orders' && orders.length > 0 && (
                <span className="bg-purple-500/20 text-purple-400 text-xs px-1.5 py-0.5 rounded-full">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* FAVORITES */}
          {tab === 'favorites' && (
            favBooks.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">Start browsing and save books you love</p>
                <Link to="/books" className="btn-primary inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Browse Books
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favBooks.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
              </div>
            )
          )}

          {/* MY BOOKS (ORDERS) */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No purchased books yet</h3>
                <p className="text-gray-500 mb-6">Your library will appear here after purchase</p>
                <Link to="/books" className="btn-primary inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Browse Books
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {orders.map((o, i) => o.book && <BookCard key={o._id} book={o.book} index={i} />)}
              </div>
            )
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            history.length === 0 ? (
              <div className="text-center py-20">
                <Clock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No reading history</h3>
                <p className="text-gray-500 mb-6">Books you open will appear here</p>
                <Link to="/books" className="btn-primary inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Start Reading
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {history.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
              </div>
            )
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <div className="max-w-lg space-y-6">

              {/* Account Info */}
              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white">Account Details</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                  ) : (
                    <button onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  )}
                </div>

                {!editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Email</label>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Member Since</label>
                      <p className="text-white font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Role</label>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' :
                        user.role === 'reviewer' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {user.role === 'admin' ? '⭐ Admin' : user.role === 'reviewer' ? '🔍 Reviewer' : '📚 Reader'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Avatar URL <span className="text-gray-600">(optional)</span></label>
                      <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                        className="input-field" placeholder="https://..." />
                      {form.avatar && (
                        <img src={form.avatar} alt="preview" className="w-12 h-12 rounded-xl object-cover mt-2"
                          onError={(e) => e.target.style.display = 'none'} />
                      )}
                    </div>
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="btn-primary flex items-center gap-2 text-sm">
                      {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Change Password */}
              <div className="glass p-6 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" /> Change Password
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm text-gray-400 mb-1">New Password</label>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={pwForm.newPw}
                      onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                      className="input-field pr-10" placeholder="Min 6 characters" />
                    <button onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-8 text-gray-500 hover:text-white transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                    <input type="password" value={pwForm.confirm}
                      onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                      className="input-field" placeholder="Repeat new password" />
                  </div>
                  <button onClick={handleChangePassword} disabled={savingPw}
                    className="btn-primary flex items-center gap-2 text-sm">
                    {savingPw ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}