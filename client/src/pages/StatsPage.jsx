import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';
import useStore from '../stores/useStore';
import api from '../api/axios';

export default function StatsPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/stats');
      setStats(data);
    } catch { }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!stats) return null;

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending Review', value: stats.pendingBooks, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-2">📊 Dashboard</h1>
        <p className="text-gray-400 mb-10">Overview of your library platform</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {cards.map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass p-5 rounded-2xl">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" /> Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {stats.recentOrders.length === 0 ? (
                <p className="text-gray-500 text-sm p-5">No orders yet</p>
              ) : stats.recentOrders.map((order) => (
                <div key={order._id} className="p-4 flex items-center gap-3">
                  <img src={order.book?.cover} alt="" className="w-10 h-12 object-cover rounded-lg shrink-0"
                    onError={(e) => e.target.style.display = 'none'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{order.book?.title}</p>
                    <p className="text-gray-500 text-xs">{order.user?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-purple-400 font-bold text-sm">${order.book?.price || 0}</p>
                    <p className="text-gray-600 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Books */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> Top Selling Books
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {stats.topBooks.length === 0 ? (
                <p className="text-gray-500 text-sm p-5">No sales yet</p>
              ) : stats.topBooks.map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-5 shrink-0">#{i + 1}</span>
                  <img src={item.book?.cover} alt="" className="w-10 h-12 object-cover rounded-lg shrink-0"
                    onError={(e) => e.target.style.display = 'none'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.book?.title}</p>
                    <p className="text-gray-500 text-xs">{item.count} sales</p>
                  </div>
                  <p className="text-green-400 font-bold text-sm shrink-0">${item.totalSales}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          {stats.revenueData?.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden lg:col-span-2">
              <div className="p-5 border-b border-white/10">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" /> Monthly Revenue
                </h2>
              </div>
              <div className="p-5">
                <div className="flex items-end gap-3 h-32">
                  {stats.revenueData.map((month, i) => {
                    const maxRevenue = Math.max(...stats.revenueData.map(m => m.revenue));
                    const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <p className="text-xs text-gray-400">${month.revenue}</p>
                        <div className="w-full bg-purple-500/20 rounded-lg transition-all"
                          style={{ height: `${Math.max(height, 5)}%` }} />
                        <p className="text-xs text-gray-500">{month._id?.slice(5)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}