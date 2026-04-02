import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../stores/useStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, user } = useStore();
  const navigate = useNavigate();
  const total = cart.reduce((sum, book) => sum + (book.price || 0), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <ShoppingCart className="w-16 h-16 text-gray-600" />
        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
        <p className="text-gray-400">Add some books to get started!</p>
        <Link to="/books" className="btn-primary mt-2">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-4xl font-black text-white mb-8">🛒 Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((book) => (
              <motion.div key={book._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass p-4 rounded-2xl flex items-center gap-4">
                <img src={book.cover} alt={book.title}
                  className="w-16 h-20 object-cover rounded-xl shrink-0"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/60x80?text=📖'} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{book.title}</h3>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  <p className="text-purple-400 font-bold mt-1">${book.price || 0}</p>
                </div>
                <button onClick={() => { removeFromCart(book._id); toast.success('Removed from cart'); }}
                  className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass p-6 rounded-2xl h-fit sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Items ({cart.length})</span>
                <span>${total}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <button onClick={() => {
              if (!user) { toast.error('Sign in to checkout'); navigate('/login'); return; }
              navigate('/checkout');
            }} className="btn-primary w-full text-center">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}