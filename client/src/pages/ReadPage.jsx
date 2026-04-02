import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BookOpen, ExternalLink, Lock } from 'lucide-react';
import api from '../api/axios';
import useStore from '../stores/useStore';
import toast from 'react-hot-toast';

export default function ReadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    checkAccess();
  }, [id, user]);

  const checkAccess = async () => {
    try {
      // جيب الكتاب الأول
      const { data: bookData } = await api.get(`/books/${id}`);

      if (bookData.isFree) {
        setBook(bookData);
        setLoading(false);
        return;
      }

      // تحقق من الشراء
      const { data: orders } = await api.get('/orders/my-orders');
      const purchased = orders.find(o => o.book?._id === id);
      if (!purchased) {
        toast.error('Purchase this book first');
        navigate(`/books/${id}`);
        return;
      }
      setBook(bookData);
    } catch {
      navigate(`/books/${id}`);
    } finally { setLoading(false); }
  };

  const handleDownload = () => {
    if (!book?.pdfUrl) { toast.error('No PDF available'); return; }
    window.open(book.pdfUrl, '_blank');
    toast.success('Opening PDF... 📥');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!book) return null;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Book Card */}
        <div className="glass rounded-3xl overflow-hidden">
          {/* Cover Banner */}
          <div className="relative h-48 overflow-hidden">
            <img src={book.cover} alt={book.title}
              className="w-full h-full object-cover blur-sm scale-110 opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center gap-6">
              <img src={book.cover} alt={book.title}
                className="h-36 w-24 object-cover rounded-xl shadow-2xl shadow-black/60" />
              <div>
                <h1 className="text-2xl font-black text-white mb-1">{book.title}</h1>
                <p className="text-gray-300 text-sm">{book.author}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                  ✅ {book.isFree ? 'Free Book' : 'Purchased'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-8">
            <h2 className="text-white font-bold text-lg mb-6 text-center">
              📚 Your Book is Ready
            </h2>

            <div className="space-y-3">
              {/* Read Online */}
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
                <BookOpen className="w-5 h-5" />
                Read Online
                <ExternalLink className="w-4 h-4 opacity-60" />
              </a>

              {/* Download */}
              <button onClick={handleDownload}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Download className="w-5 h-5 text-purple-400" />
                Download PDF
              </button>
            </div>

            {/* Info */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white font-bold">{book.pages || '—'}</p>
                <p className="text-gray-500 text-xs mt-0.5">Pages</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white font-bold">{book.language || '—'}</p>
                <p className="text-gray-500 text-xs mt-0.5">Language</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-white font-bold">{book.publishYear || '—'}</p>
                <p className="text-gray-500 text-xs mt-0.5">Year</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 mt-6 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> For your personal use only
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}