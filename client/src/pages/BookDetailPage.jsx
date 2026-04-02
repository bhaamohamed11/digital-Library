import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Heart, Star, Calendar, Globe, FileText, User, ShoppingCart, Download } from 'lucide-react';
import useStore from '../stores/useStore';
import StarRating from '../components/StarRating';
import { BookCardSkeleton } from '../components/Skeleton';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBook, fetchBook, loading, user, toggleFavorite, isFavorite, addToCart, isInCart, removeFromCart } = useStore();
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [buying, setBuying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fav = isFavorite(id);
  const inCart = isInCart(id);
  const canRead = currentBook && (currentBook.isFree || purchased);

  useEffect(() => {
    fetchBook(id);
    loadReviews();
    checkPurchased();
  }, [id]);

  const loadReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${id}`);
      setReviews(data);
    } catch { }
  };

  const checkPurchased = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/orders/my-orders');
      setPurchased(data.some(order => order.book?._id === id));
    } catch { }
  };

  const handleFavorite = async () => {
    if (!user) { toast.error('Sign in to add favorites'); return; }
    const ok = await toggleFavorite(id);
    if (ok) toast.success(fav ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to leave a review'); return; }
    if (!myRating) { toast.error('Please select a star rating'); return; }
    setSubmitting(true);
    try {
      await api.post('/reviews', { book: id, rating: myRating, comment: myComment });
      toast.success('Review submitted!');
      setMyRating(0);
      setMyComment('');
      loadReviews();
      fetchBook(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  const handleBuy = async () => {
    if (!user) { toast.error('Sign in to purchase'); return; }
    setBuying(true);
    try {
      await api.post(`/orders/${id}`);
      toast.success('Purchase successful! 🎉');
      setPurchased(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally { setBuying(false); }
  };

  const handleDownload = async () => {
    if (!currentBook?.pdfUrl) { toast.error('No PDF available'); return; }
    setDownloading(true);
    toast.loading('Preparing download...', { id: 'dl' });
    try {
      const res = await fetch(currentBook.pdfUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentBook.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded! 📥', { id: 'dl' });
    } catch {
      toast.error('Download failed', { id: 'dl' });
    } finally { setDownloading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BookCardSkeleton />
          <div className="md:col-span-2 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-800/60 rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!currentBook) return null;
  const book = currentBook;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Cover */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 mb-4">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover"
                  onError={(e) => e.target.src = `https://via.placeholder.com/300x400/1a1a2e/7C3AED?text=${encodeURIComponent(book.title.slice(0, 8))}`} />
              </div>

              <div className="flex flex-col gap-3">
                {/* Cart */}
                <button onClick={() => {
                  if (!user) { toast.error('Sign in first'); return; }
                  if (inCart) { removeFromCart(book._id); toast.success('Removed from cart'); }
                  else { const added = addToCart(book); if (added) toast.success('Added to cart! 🛒'); }
                }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-medium
                    ${inCart ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30' : 'border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-purple-400'}`}>
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? 'Remove from Cart ✕' : 'Add to Cart'}
                </button>

                <div className="flex gap-3">
                  {/* Favorite */}
                  <button onClick={handleFavorite}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-medium
                      ${fav ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'border-white/10 text-gray-400 hover:border-pink-500/30 hover:text-pink-400'}`}>
                    <Heart className={`w-4 h-4 ${fav ? 'fill-pink-400' : ''}`} />
                    {fav ? 'Saved' : 'Save'}
                  </button>

                  {/* Buy button فقط لو مش اشترى */}
                  {!canRead && (
                    <button onClick={handleBuy} disabled={buying}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
                      {buying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                      {buying ? 'Processing...' : `Buy $${book.price}`}
                    </button>
                  )}

                  {/* Download button بعد الشراء */}
                  {canRead && book.pdfUrl && (
                    <button onClick={handleDownload} disabled={downloading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 transition-all text-sm font-medium">
                      {downloading
                        ? <span className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                        : <Download className="w-4 h-4" />}
                      {downloading ? 'Downloading...' : 'Download'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2">
            <span className="tag text-xs mb-4 inline-block">{book.category}</span>
            <h1 className="text-4xl font-black text-white mb-2 leading-tight">{book.title}</h1>
            <p className="text-xl text-gray-400 mb-6 flex items-center gap-2">
              <User className="w-4 h-4" /> {book.author}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="glass p-4 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{Number(book.rating).toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-500">{book.reviewCount} reviews</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="font-bold text-white flex items-center justify-center gap-1"><FileText className="w-4 h-4" />{book.pages}</p>
                <p className="text-xs text-gray-500">Pages</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="font-bold text-white flex items-center justify-center gap-1"><Calendar className="w-4 h-4" />{book.publishYear}</p>
                <p className="text-xs text-gray-500">Published</p>
              </div>
              <div className="glass p-4 rounded-xl text-center">
                <p className="font-bold text-white flex items-center justify-center gap-1"><Globe className="w-4 h-4" />{book.language}</p>
                <p className="text-xs text-gray-500">Language</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">About This Book</h2>
              <p className="text-gray-400 leading-relaxed">{book.description}</p>
            </div>

            {book.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {book.tags.map((t) => <span key={t} className="tag text-xs">{t}</span>)}
              </div>
            )}

            {/* ===== PDF READER - بيظهر بس بعد الشراء ===== */}
            {canRead && book.pdfUrl && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" /> Read Book
                  </h2>
                  <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    ✅ {book.isFree ? 'Free' : 'Purchased'}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe
                    src={book.pdfUrl}
                    className="w-full border-0"
                    style={{ height: '75vh' }}
                    title={book.title}
                  />
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              {user && (
                <form onSubmit={handleReview} className="glass p-6 rounded-2xl mb-6">
                  <h3 className="font-semibold text-white mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Your Rating</p>
                    <StarRating rating={myRating} onRate={setMyRating} size="lg" />
                  </div>
                  <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)}
                    placeholder="Share your thoughts about this book..." rows={3}
                    className="input-field resize-none mb-4" />
                  <button type="submit" disabled={submitting} className="btn-primary text-sm flex items-center gap-2">
                    {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Submit Review
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
                ) : reviews.map((r) => (
                  <div key={r._id} className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center overflow-hidden shrink-0">
                        {r.user?.avatar ? <img src={r.user.avatar} className="w-full h-full object-cover" alt="" /> : <User className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{r.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-400">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}