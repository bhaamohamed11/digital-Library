require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
  { name: 'Fiction', slug: 'fiction', icon: '📖', color: '#7C3AED', gradient: 'from-purple-600 to-indigo-600', description: 'Novels, short stories, and literary fiction' },
  { name: 'Science', slug: 'science', icon: '🔬', color: '#0EA5E9', gradient: 'from-cyan-500 to-blue-600', description: 'Physics, biology, astronomy, and more' },
  { name: 'History', slug: 'history', icon: '🏛️', color: '#F59E0B', gradient: 'from-amber-500 to-orange-600', description: 'World history, civilizations, and events' },
  { name: 'Technology', slug: 'technology', icon: '💻', color: '#10B981', gradient: 'from-emerald-500 to-teal-600', description: 'Programming, AI, software engineering' },
  { name: 'Philosophy', slug: 'philosophy', icon: '🧠', color: '#EF4444', gradient: 'from-rose-500 to-pink-600', description: 'Ethics, metaphysics, and existentialism' },
  { name: 'Art', slug: 'art', icon: '🎨', color: '#F97316', gradient: 'from-orange-500 to-red-500', description: 'Visual arts, literature, and poetry' },
];

const books = [
  // Fiction
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age of the 1920s. A timeless critique of the American Dream.',
    cover: 'https://covers.openlibrary.org/b/id/8432495-L.jpg',
    category: 'Fiction', tags: ['classic', 'american', 'jazz age'], language: 'English', pages: 180, publishYear: 1925, rating: 4.7, reviewCount: 520, downloads: 2400, featured: true,
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian masterpiece set in a totalitarian society ruled by Big Brother. Winston Smith struggles to maintain his sanity and humanity in a world of surveillance and propaganda.',
    cover: 'https://covers.openlibrary.org/b/id/8575708-L.jpg',
    category: 'Fiction', tags: ['dystopia', 'political', 'classic'], language: 'English', pages: 328, publishYear: 1949, rating: 4.9, reviewCount: 890, downloads: 4200, featured: true,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'Through the eyes of young Scout Finch in 1930s Alabama, this Pulitzer Prize-winning novel explores racial injustice, loss of innocence, and moral complexity.',
    cover: 'https://covers.openlibrary.org/b/id/8226309-L.jpg',
    category: 'Fiction', tags: ['classic', 'justice', 'pulitzer'], language: 'English', pages: 324, publishYear: 1960, rating: 4.8, reviewCount: 670, downloads: 3100, featured: true,
  },
  {
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'A poetic and philosophical tale about a young prince who visits various planets and learns about love, loneliness, and the importance of seeing with the heart.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Fiction', tags: ['philosophy', 'children', 'classic'], language: 'English', pages: 96, publishYear: 1943, rating: 4.9, reviewCount: 1100, downloads: 5000, featured: true,
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'The story of Elizabeth Bennet and the proud Mr. Darcy in Regency England. A witty exploration of love, marriage, class, and personal growth.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Fiction', tags: ['romance', 'classic', 'british'], language: 'English', pages: 432, publishYear: 1813, rating: 4.8, reviewCount: 780, downloads: 3800,
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    description: 'A psychological thriller following a poor student who commits murder and is then consumed by guilt. A profound exploration of morality, redemption, and the human psyche.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Fiction', tags: ['russian', 'psychology', 'classic'], language: 'English', pages: 671, publishYear: 1866, rating: 4.7, reviewCount: 430, downloads: 1900,
  },

  // Science
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'Stephen Hawking explains complex cosmological concepts — the Big Bang, black holes, and the nature of time — in an accessible and groundbreaking book for general readers.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Science', tags: ['physics', 'cosmos', 'popular science'], language: 'English', pages: 212, publishYear: 1988, rating: 4.7, reviewCount: 620, downloads: 2800, featured: true,
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    description: 'A landmark work in evolutionary biology that introduced the concept of gene-centered evolution, reframing how we think about natural selection and the origins of altruism.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Science', tags: ['biology', 'evolution', 'genetics'], language: 'English', pages: 360, publishYear: 1976, rating: 4.6, reviewCount: 345, downloads: 1500,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A sweeping narrative of human history from the Stone Age through to the 21st century, exploring how Homo sapiens came to dominate the planet.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Science', tags: ['history', 'anthropology', 'bestseller'], language: 'English', pages: 443, publishYear: 2011, rating: 4.7, reviewCount: 980, downloads: 4500, featured: true,
  },
  {
    title: "Sophie's World",
    author: 'Jostein Gaarder',
    description: 'A young girl receives mysterious letters from an unknown philosopher, taking her on a journey through the history of Western philosophy from Socrates to Sartre.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Science', tags: ['philosophy', 'novel', 'educational'], language: 'English', pages: 509, publishYear: 1991, rating: 4.6, reviewCount: 267, downloads: 1150,
  },

  // History
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    description: 'A Pulitzer Prize-winning exploration of why some civilizations conquered others, attributing the differences to environment, geography, and the availability of plants and animals.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'History', tags: ['civilization', 'anthropology', 'pulitzer'], language: 'English', pages: 480, publishYear: 1997, rating: 4.5, reviewCount: 512, downloads: 2200, featured: true,
  },
  {
    title: 'The Rise and Fall of the Roman Empire',
    author: 'Edward Gibbon',
    description: 'A monumental work covering thirteen centuries of Roman history, analyzing the political, religious, and social forces that led to the decline of one of the greatest empires in history.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'History', tags: ['roman', 'empire', 'classic'], language: 'English', pages: 1600, publishYear: 1776, rating: 4.6, reviewCount: 198, downloads: 900,
  },
  {
    title: 'The Crusades Through Arab Eyes',
    author: 'Amin Maalouf',
    description: 'A fascinating retelling of the Crusades from the perspective of the Arab world, drawing on original Arab sources to reveal a side of history rarely taught in Western schools.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'History', tags: ['crusades', 'middle east', 'perspective'], language: 'English', pages: 296, publishYear: 1983, rating: 4.7, reviewCount: 231, downloads: 1050,
  },
  {
    title: 'A Short History of Nearly Everything',
    author: 'Bill Bryson',
    description: 'A witty and humorous journey through the history of science, from the Big Bang to the rise of civilization, explaining complex scientific concepts in an entertaining way.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'History', tags: ['science history', 'popular', 'funny'], language: 'English', pages: 544, publishYear: 2003, rating: 4.8, reviewCount: 412, downloads: 1800, featured: true,
  },

  // Technology
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. Martin shows the best practices for writing code that is readable, maintainable, and elegant, with real code examples.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Technology', tags: ['programming', 'software engineering', 'best practices'], language: 'English', pages: 464, publishYear: 2008, rating: 4.9, reviewCount: 650, downloads: 4200, featured: true,
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    description: 'The definitive academic reference for artificial intelligence, covering algorithms, machine learning, natural language processing, computer vision, and robotics.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Technology', tags: ['AI', 'algorithms', 'academic'], language: 'English', pages: 1152, publishYear: 2020, rating: 4.8, reviewCount: 380, downloads: 2800,
  },
  {
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    description: 'A fast-paced, hands-on introduction to programming with Python for beginners, covering the basics and then building real projects: games, data visualizations, and web apps.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Technology', tags: ['Python', 'programming', 'beginners'], language: 'English', pages: 544, publishYear: 2019, rating: 4.7, reviewCount: 540, downloads: 3500, featured: true,
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    description: 'A book about the craft of programming. Tips, philosophies, and practical advice for becoming a more effective developer and delivering better software.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Technology', tags: ['programming', 'career', 'best practices'], language: 'English', pages: 352, publishYear: 2019, rating: 4.8, reviewCount: 425, downloads: 2600,
  },

  // Philosophy
  {
    title: 'The Republic',
    author: 'Plato',
    description: 'One of the most influential works in Western philosophy, exploring justice, the ideal state, the philosopher-king, and the allegory of the cave.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Philosophy', tags: ['greek', 'classic', 'politics'], language: 'English', pages: 416, publishYear: -380, rating: 4.6, reviewCount: 398, downloads: 2100, featured: true,
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'The private philosophical diary of Roman Emperor Marcus Aurelius, offering timeless wisdom on Stoic philosophy, virtue, resilience, and the meaning of life.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Philosophy', tags: ['stoicism', 'roman', 'self-help'], language: 'English', pages: 256, publishYear: 180, rating: 4.8, reviewCount: 612, downloads: 3200, featured: true,
  },
  {
    title: 'Being and Nothingness',
    author: 'Jean-Paul Sartre',
    description: 'The foundational text of existentialist philosophy, exploring consciousness, freedom, and responsibility. Sartre argues that existence precedes essence.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Philosophy', tags: ['existentialism', 'french', 'freedom'], language: 'English', pages: 640, publishYear: 1943, rating: 4.4, reviewCount: 198, downloads: 950,
  },
  {
    title: 'Nicomachean Ethics',
    author: 'Aristotle',
    description: 'Aristotle\'s seminal work on ethics, exploring virtue, happiness (eudaimonia), and the good life. A cornerstone of Western moral philosophy still widely studied today.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Philosophy', tags: ['greek', 'ethics', 'virtue'], language: 'English', pages: 352, publishYear: -340, rating: 4.5, reviewCount: 245, downloads: 1400,
  },

  // Art
  {
    title: 'The Story of Art',
    author: 'E.H. Gombrich',
    description: 'The world\'s most famous art book, taking readers on a journey from cave paintings to the twentieth century, explaining how and why styles and techniques evolved.',
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    category: 'Art', tags: ['art history', 'global', 'reference'], language: 'English', pages: 688, publishYear: 1950, rating: 4.8, reviewCount: 389, downloads: 1700,
  },
  {
    title: 'Ways of Seeing',
    author: 'John Berger',
    description: 'A revolutionary examination of how we look at art. Berger challenges traditional art criticism with fresh perspectives on gender, oil painting, and advertising imagery.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Art', tags: ['art criticism', 'cultural', 'modern'], language: 'English', pages: 166, publishYear: 1972, rating: 4.6, reviewCount: 278, downloads: 1200, featured: true,
  },
  {
    title: 'The Artist\'s Way',
    author: 'Julia Cameron',
    description: 'A 12-week program designed to recover and unlock creativity. Used by millions of artists worldwide, it provides practical exercises for breaking creative blocks.',
    cover: 'https://covers.openlibrary.org/b/id/8739173-L.jpg',
    category: 'Art', tags: ['creativity', 'self-help', 'workshop'], language: 'English', pages: 256, publishYear: 1992, rating: 4.7, reviewCount: 445, downloads: 2100, featured: true,
  },
  {
    title: 'On Writing',
    author: 'Stephen King',
    description: 'Part memoir, part master class in writing. King shares the story of his life and craft, offering practical advice for aspiring writers on style, discipline, and storytelling.',
    cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    category: 'Art', tags: ['writing', 'memoir', 'craft'], language: 'English', pages: 320, publishYear: 2000, rating: 4.9, reviewCount: 720, downloads: 3400,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Book.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Seed categories
    const savedCats = await Category.insertMany(categories);
    // Update bookCount for each category
    for (const cat of savedCats) {
      const count = books.filter(b => b.category === cat.name).length;
      await Category.findByIdAndUpdate(cat._id, { bookCount: count });
    }
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed books
    await Book.insertMany(books);
    console.log(`✅ Seeded ${books.length} books`);

    // Create admin user
    await User.create({
      name: 'Library Admin',
      email: 'admin@library.com',
      password: 'admin123456',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=7C3AED&color=fff'
    });

    // Create test user
    await User.create({
      name: 'John Reader',
      email: 'user@library.com',
      password: 'user123456',
      avatar: 'https://ui-avatars.com/api/?name=John+Reader&background=06B6D4&color=fff'
    });

    console.log('✅ Created admin (admin@library.com / admin123456) and test user (user@library.com / user123456)');
    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
