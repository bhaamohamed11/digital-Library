import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag, Download } from 'lucide-react';
import useStore from '../stores/useStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleDownload = (book) => {
    if (!book?.pdfUrl) { toast.error('No PDF available for this book'); return; }
    const a = document.createElement('a');
    a.href = book.pdfUrl;
    a.download = `${book.title}.pdf`;
    a.target = '_blank';
    a.click();
    toast.success('Download started! 📥');
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <ShoppingBag className="w-16 h-16 text-gray-600" />
      <h2 className="text-2xl font-bold text-white">No orders yet</h2>
      <p className="text-gray-400">Your purchased books will appear here</p>
      <Link to="/books" className="btn-primary mt-2">Browse Books</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-8">📦 My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass p-4 rounded-2xl flex items-center gap-4">
              <img src={order.book?.cover} alt={order.book?.title}
                className="w-16 h-20 object-cover rounded-xl shrink-0"
                onError={(e) => e.target.src = 'https://via.placeholder.com/60x80?text=📖'} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{order.book?.title}</h3>
                <p className="text-sm text-gray-400">{order.book?.author}</p>
                <p className="text-purple-400 font-bold mt-1">${order.price}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => navigate(`/read/${order.book?._id}`)}
                  className="btn-primary flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4" /> Read
                </button>
                <button onClick={() => handleDownload(order.book)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-colors border border-white/10">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}