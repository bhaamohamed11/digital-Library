/** 
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ReadPage from './pages/ReadPage';
import StatsPage from './pages/StatsPage';
import AuthorsPage from './pages/AuthorsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/read/:id" element={<ReadPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
{ (location.pathname === '/' || location.pathname === '/contact') && <Footer /> }    </BrowserRouter>
  );
}
**/



import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ReadPage from './pages/ReadPage';
import StatsPage from './pages/StatsPage';
import AuthorsPage from './pages/AuthorsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
        }}
      />
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/read/:id" element={<ReadPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Footer يظهر فقط في الصفحة الرئيسية */}
      {location.pathname === '/' && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}





