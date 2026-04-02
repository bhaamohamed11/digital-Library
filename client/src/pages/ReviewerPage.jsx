import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Search } from 'lucide-react';
import useStore from '../stores/useStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ReviewerPage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'reviewer' && user.role !== 'admin')) {
      navigate('/');
      return;
    }
    loadBooks();
  }, [user]);

  const loadBooks = async () => {
    try {
      const { data } = await api.get('/reviewer/books');
      setBooks(data);
    } catch { }
    finally { setLoading(false); }
  };

  const handleStatus = async (bookId, status) => {
    try {
      await api.put(`/reviewer/books/${bookId}`, { status, reviewNote: note });
      toast.success(`Book marked as ${status}!`);
      setSelectedBook(null);
      setNote('');
      loadBooks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-2">🔍 Reviewer Panel</h1>
        <p className="text-gray-400 mb-8">{books.length} books waiting for review</p>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">All caught up!</h2>
            <p className="text-gray-400">No books waiting for review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <motion.div key={book._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                  <img src={book.cover} alt={book.title}
                    className="w-16 h-20 object-cover rounded-xl shrink-0"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/60x80?text=📖'} />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{book.title}</h3>
                    <p className="text-gray-400 text-sm">{book.author}</p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{book.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {book.status === 'submit' && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">⏳ Submitted</span>}
                      {book.status === 'review' && <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">🔍 In Review</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => setSelectedBook(selectedBook === book._id ? null : book._id)}
                      className="btn-primary text-sm flex items-center gap-2">
                      <Search className="w-4 h-4" /> Review
                    </button>
                    <button onClick={() => handleStatus(book._id, 'published')}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm transition-colors">
                      <CheckCircle className="w-4 h-4" /> Publish
                    </button>
                    <button onClick={() => handleStatus(book._id, 'review')}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm transition-colors">
                      <Clock className="w-4 h-4" /> Mark In Review
                    </button>
                  </div>
                </div>

                {selectedBook === book._id && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 border-t border-white/10 pt-4">
                    <label className="text-sm text-gray-400 mb-2 block">Review Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)}
                      placeholder="Add your review notes here..."
                      rows={3} className="input-field resize-none mb-3" />
                    <div className="flex gap-2">
                      <button onClick={() => handleStatus(book._id, 'published')}
                        className="btn-primary text-sm">
                        ✅ Approve & Publish
                      </button>
                      <button onClick={() => { setSelectedBook(null); setNote(''); }}
                        className="btn-secondary text-sm">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}