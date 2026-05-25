import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag, Download, ArrowLeft } from 'lucide-react';
import useStore from '../stores/useStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readerBook, setReaderBook] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleDownload = async (book) => {
    if (!book?.pdfUrl) { toast.error('No PDF available'); return; }
    toast.loading('Preparing...', { id: 'dl' });
    try {
      const res = await fetch(book.pdfUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded! 📥', { id: 'dl' });
    } catch { toast.error('Download failed', { id: 'dl' }); }
  };

  // ===== PDF READER =====
  if (readerBook) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/10 shrink-0">
          <button onClick={() => setReaderBook(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-sm truncate">{readerBook.title}</p>
            <p className="text-gray-500 text-xs">{readerBook.author}</p>
          </div>
          <button onClick={() => handleDownload(readerBook)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs hover:bg-purple-600/30 transition-colors">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          <iframe
            src={readerBook.pdfUrl}
            className="w-full h-full border-0"
            title={readerBook.title}
          />
        </div>
      </div>
    );
  }

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
                {order.book?.pdfUrl ? (
                  <button onClick={() => setReaderBook(order.book)}
                    className="btn-primary flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4" /> Read
                  </button>
                ) : (
                  <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-600 text-sm cursor-not-allowed">
                    <BookOpen className="w-4 h-4" /> No PDF
                  </button>
                )}
                {order.book?.pdfUrl && (
                  <button onClick={() => handleDownload(order.book)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-sm transition-colors border border-white/10">
                    <Download className="w-4 h-4" /> Download
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}