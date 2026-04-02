import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Download, FileText } from 'lucide-react';
import useStore from '../stores/useStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const total = cart.reduce((sum, book) => sum + (book.price || 0), 0);

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orders = [];
      for (const book of cart) {
        const { data } = await api.post(`/orders/${book._id}`);
        orders.push({ ...data, book });
      }
      setOrderData({ orders, cart: [...cart], total, date: new Date() });
      clearCart();
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  const downloadInvoice = () => {
    if (!orderData) return;

    const date = new Date(orderData.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const itemsHTML = orderData.cart.map(book => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">${book.title}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;">${book.author}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">$${book.price || 0}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - MyLibrary</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #333; }
          .header { background: linear-gradient(135deg, #7C3AED, #4F46E5); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 5px 0 0; opacity: 0.8; }
          .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info div { background: #f9f9f9; padding: 15px 20px; border-radius: 8px; flex: 1; margin: 0 5px; }
          .info div:first-child { margin-left: 0; }
          .info div:last-child { margin-right: 0; }
          .info label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
          .info p { margin: 5px 0 0; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          thead { background: #f0f0f0; }
          th { padding: 12px 10px; text-align: left; font-size: 13px; color: #666; }
          .total-row { background: #7C3AED; color: white; }
          .total-row td { padding: 14px 10px; font-weight: bold; font-size: 16px; }
          .footer { text-align: center; margin-top: 40px; color: #aaa; font-size: 12px; }
          .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📚 MyLibrary</h1>
          <p>Digital Book Store — Purchase Invoice</p>
        </div>
        <div class="info">
          <div><label>Customer</label><p>${user.name}</p></div>
          <div><label>Email</label><p>${user.email}</p></div>
          <div><label>Date</label><p>${date}</p></div>
          <div><label>Status</label><p><span class="badge">✅ Paid</span></p></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th style="text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr class="total-row">
              <td colspan="2">Total</td>
              <td style="text-align:right;">$${orderData.total}</td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>Thank you for your purchase! 🎉</p>
          <p>MyLibrary — Your Digital Reading Platform</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded! 🧾');
  };

  if (done) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle className="w-20 h-20 text-green-400" />
        </motion.div>
        <h2 className="text-3xl font-black text-white">Purchase Successful! 🎉</h2>
        <p className="text-gray-400">Your books are now available to read</p>

        {/* Invoice Summary */}
        {orderData && (
          <div className="glass p-6 rounded-2xl w-full max-w-md mt-2">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Order Summary
            </h3>
            {orderData.cart.map((book) => (
              <div key={book._id} className="flex justify-between text-sm text-gray-400 mb-2">
                <span className="truncate max-w-48">{book.title}</span>
                <span>${book.price || 0}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 mt-2 flex justify-between font-bold text-white">
              <span>Total Paid</span>
              <span className="text-green-400">${orderData.total}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button onClick={downloadInvoice}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 font-medium transition-colors">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
          <button onClick={() => navigate('/orders')} className="btn-primary">
            My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-4xl font-black text-white mb-8">💳 Checkout</h1>

        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" /> Payment Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Card Number</label>
              <input className="input-field" placeholder="4242 4242 4242 4242" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Expiry Date</label>
                <input className="input-field" placeholder="MM/YY" maxLength={5} />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">CVV</label>
                <input className="input-field" placeholder="123" maxLength={3} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Card Holder Name</label>
              <input className="input-field" placeholder="John Doe" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl mb-6">
          <h2 className="font-bold text-white mb-4">Order Summary</h2>
          {cart.map(book => (
            <div key={book._id} className="flex justify-between text-sm text-gray-400 mb-2">
              <span className="truncate max-w-48">{book.title}</span>
              <span>${book.price || 0}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold text-white">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Lock className="w-5 h-5" />}
          {loading ? 'Processing...' : `Pay $${total}`}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> This is a simulated payment — no real charge
        </p>
      </div>
    </div>
  );
}