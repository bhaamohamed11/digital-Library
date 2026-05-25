import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    // محاكاة إرسال
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success('Message sent successfully! 🎉');
  };

  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: 'support@mylibrary.com',
      href: 'mailto:support@mylibrary.com',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+20 100 000 0000',
      href: 'tel:+201000000000',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Cairo, Egypt',
      href: 'https://maps.google.com',
      color: 'from-amber-500 to-orange-500',
    },
  ];

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    color: 'hover:bg-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    color: 'hover:bg-sky-500',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    color: 'hover:bg-pink-600',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    color: 'hover:bg-blue-700',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">📬 Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }} className="space-y-6">

            {/* Contact Cards */}
            {contacts.map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                className="glass p-5 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{c.label}</p>
                  <p className="text-white font-medium">{c.value}</p>
                </div>
              </a>
            ))}

            {/* Social Media */}
            <div className="glass p-5 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all ${s.color}`}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="glass p-5 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Working Hours</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mon - Fri</span>
                  <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }} className="lg:col-span-2">

            {sent ? (
              <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle className="w-20 h-20 text-green-400 mb-6" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">Message Sent! 🎉</h2>
                <p className="text-gray-400 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-primary">Send Another Message</button>
              </div>
            ) : (
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Your Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email Address *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-field" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6} className="input-field resize-none"
                      placeholder="Write your message here..." />
                  </div>
                  <button type="submit" disabled={sending}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base">
                    {sending
                      ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Send className="w-5 h-5" />}
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}