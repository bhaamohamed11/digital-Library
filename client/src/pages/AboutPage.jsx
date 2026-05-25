import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Eye, Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: BookOpen,
      title: 'Knowledge for Everyone',
      desc: 'We believe every person deserves access to quality books and knowledge, regardless of where they are.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To build the most accessible digital library — where readers can discover, purchase, and read books seamlessly.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      desc: 'A world where books are just one click away — no barriers, no limits, just pure knowledge.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Heart,
      title: 'Built with Passion',
      desc: 'Every feature in MyLibrary is crafted with care — from the reading experience to the checkout flow.',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4">About MyLibrary</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            A digital library built for readers who love books — simple, fast, and accessible from anywhere.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-black text-white mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              MyLibrary started with a simple idea — make books accessible to everyone online.
              We noticed that finding, buying, and reading books digitally was complicated and fragmented.
            </p>
            <p>
              So we built a platform that brings everything together: browse thousands of titles,
              purchase instantly, and read directly in your browser — no extra apps needed.
            </p>
            <p>
              Today, MyLibrary is a growing platform with a passionate community of readers,
              all connected by their love of knowledge and stories.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-black text-white mb-6">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="glass p-6 rounded-2xl">
                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center glass p-10 rounded-2xl">
          <h2 className="text-2xl font-black text-white mb-3">Ready to Start Reading?</h2>
          <p className="text-gray-400 mb-6">Join thousands of readers on MyLibrary today.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/books" className="btn-primary flex items-center gap-2">
              Browse Books <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              Join Free
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}