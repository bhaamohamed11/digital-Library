import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Star, BookOpen, Tag, Upload, FileUp } from "lucide-react";
import useStore from "../stores/useStore";
import api from "../api/axios";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  title: "", author: "", description: "", cover: "", category: "Fiction",
  language: "English", pages: "", publishYear: "", featured: false,
  pdfUrl: "", price: 0, isFree: false, status: "published",
};

export default function AdminPage() {
  const { user, fetchBooks, books, loading } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("books");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [catForm, setCatForm] = useState({ name: "", icon: "📚", description: "" });
  const [editingCat, setEditingCat] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catSubmitting, setCatSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    fetchBooks({ limit: 100 });
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch { toast.error("Failed to load categories"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/books/${editing}`, form);
        toast.success("Book updated!");
      } else {
        await api.post("/books", form);
        toast.success("Book added!");
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setShowForm(false);
      fetchBooks({ limit: 100 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally { setSubmitting(false); }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title, author: book.author, description: book.description,
      cover: book.cover, category: book.category, language: book.language,
      pages: book.pages, publishYear: book.publishYear, featured: book.featured,
      pdfUrl: book.pdfUrl || "", price: book.price || 0,
      isFree: book.isFree || false, status: book.status || "published",
    });
    setEditing(book._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success("Book deleted");
      fetchBooks({ limit: 100 });
    } catch { toast.error("Delete failed"); }
  };

  // Category handlers
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setCatSubmitting(true);
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat}`, catForm);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", catForm);
        toast.success("Category added!");
      }
      setCatForm({ name: "", icon: "📚", description: "" });
      setEditingCat(null);
      setShowCatForm(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setCatSubmitting(false); }
  };

  const handleEditCat = (cat) => {
    setCatForm({ name: cat.name, icon: cat.icon || "📚", description: cat.description || "" });
    setEditingCat(cat._id);
    setShowCatForm(true);
  };

  const handleDeleteCat = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      loadCategories();
    } catch { toast.error("Delete failed"); }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">⚙️ Admin Panel</h1>
            <p className="text-gray-400">{books.length} books · {categories.length} categories</p>
          </div>
          <button onClick={() => {
            if (activeTab === "books") { setForm(EMPTY_FORM); setEditing(null); setShowForm(!showForm); }
            else { setCatForm({ name: "", icon: "📚", description: "" }); setEditingCat(null); setShowCatForm(!showCatForm); }
          }} className="btn-primary flex items-center gap-2">
            {(activeTab === "books" ? showForm : showCatForm) ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {(activeTab === "books" ? showForm : showCatForm) ? "Cancel" : activeTab === "books" ? "Add Book" : "Add Category"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab("books")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "books" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            <BookOpen className="w-4 h-4" /> Books
          </button>
          <button onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "categories" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
            <Tag className="w-4 h-4" /> Categories
          </button>
        </div>

        {/* ===== BOOKS TAB ===== */}
        {activeTab === "books" && (
          <>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl mb-10">
                <h2 className="text-xl font-bold text-white mb-6">{editing ? "Edit Book" : "Add New Book"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400 mb-1 block">Title *</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Book title" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Author *</label>
                    <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input-field" placeholder="Author name" /></div>
                  <div className="sm:col-span-2"><label className="text-sm text-gray-400 mb-1 block">Description *</label>
                    <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" placeholder="Book description" /></div>
                    <div>
  <label className="text-sm text-gray-400 mb-1 block">Cover Image *</label>
  <div className="flex gap-2">
    <input value={form.cover} onChange={(e) => setForm({ ...form, cover: e.target.value })}
      className="input-field flex-1" placeholder="https://... أو ارفع صورة" />
    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm cursor-pointer transition-colors shrink-0">
      <Upload className="w-4 h-4" />
      {uploadingImg ? <span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" /> : 'Upload'}
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const file = e.target.files[0]; if (!file) return;
        setUploadingImg(true);
        try {
          const fd = new FormData(); fd.append('file', file);
          const { data } = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          setForm(f => ({ ...f, cover: data.url }));
          toast.success('Image uploaded! ✅');
        } catch { toast.error('Image upload failed'); }
        finally { setUploadingImg(false); }
      }} />
    </label>
  </div>
  {form.cover && <img src={form.cover} alt="preview" className="w-16 h-20 object-cover rounded-lg mt-2" onError={(e) => e.target.style.display='none'} />}
</div>

<div>
  <label className="text-sm text-gray-400 mb-1 block">PDF File *</label>
  <div className="flex gap-2">
    <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
      className="input-field flex-1" placeholder="https://... أو ارفع PDF" />
    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 hover:text-purple-300 text-sm cursor-pointer transition-colors shrink-0">
      <FileUp className="w-4 h-4" />
      {uploadingPdf ? <span className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" /> : 'Upload PDF'}
      <input type="file" accept="application/pdf" className="hidden" onChange={async (e) => {
        const file = e.target.files[0]; if (!file) return;
        setUploadingPdf(true);
        try {
          const fd = new FormData(); fd.append('file', file);
          const { data } = await api.post('/upload/pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
          setForm(f => ({ ...f, pdfUrl: data.url }));
          toast.success('PDF uploaded! ✅');
        } catch { toast.error('PDF upload failed'); }
        finally { setUploadingPdf(false); }
      }} />
    </label>
  </div>
  {form.pdfUrl && <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1"><FileUp className="w-3 h-3" /> PDF ready</p>}
</div>
                
                  <div><label className="text-sm text-gray-400 mb-1 block">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                      {categories.length > 0
                        ? categories.map((c) => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)
                        : ["Fiction","Science","History","Technology","Philosophy","Art"].map(c => <option key={c}>{c}</option>)}
                    </select></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Language</label>
                    <input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="input-field" placeholder="English" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Pages</label>
                    <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} className="input-field" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Publish Year</label>
                    <input type="number" value={form.publishYear} onChange={(e) => setForm({ ...form, publishYear: e.target.value })} className="input-field" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Price ($)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                      <option value="published">✅ Published</option>
                      <option value="submit">⏳ Submitted (for review)</option>
                      <option value="review">🔍 Under Review</option>
                    </select></div>
                  <div className="sm:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                      <span className="text-sm text-gray-300">Free Book</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                      <span className="text-sm text-gray-300">Featured</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                      {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      {editing ? "Save Changes" : "Add Book"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex items-center gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr className="text-gray-400 text-left">
                      <th className="p-4">Book</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={book.cover} alt="" className="w-10 h-14 object-cover rounded-lg" onError={(e) => (e.target.style.display = "none")} />
                            <div>
                              <p className="font-medium text-white line-clamp-1">{book.title}</p>
                              <p className="text-xs text-gray-400">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4"><span className="tag text-xs">{book.category}</span></td>
                        <td className="p-4 text-amber-400 font-medium">
                          <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" />{Number(book.rating).toFixed(1)}</div>
                        </td>
                        <td className="p-4 text-purple-400 font-bold">
                          {book.isFree ? <span className="text-green-400">Free</span> : `$${book.price || 0}`}
                        </td>
                        <td className="p-4">
                          {book.status === 'published' && <span className="text-xs text-green-400">✅ Published</span>}
                          {book.status === 'submit' && <span className="text-xs text-yellow-400">⏳ Submitted</span>}
                          {book.status === 'review' && <span className="text-xs text-blue-400">🔍 In Review</span>}
                          {!book.status && <span className="text-xs text-gray-500">—</span>}
                        </td>
                        <td className="p-4">{book.featured && <span className="text-amber-400 text-xs">⭐ Yes</span>}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(book)} className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center transition-colors">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(book._id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ===== CATEGORIES TAB ===== */}
        {activeTab === "categories" && (
          <>
            {showCatForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-2xl mb-8">
                <h2 className="text-xl font-bold text-white mb-6">{editingCat ? "Edit Category" : "Add New Category"}</h2>
                <form onSubmit={handleCatSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400 mb-1 block">Name *</label>
                    <input required value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="input-field" placeholder="e.g. Fiction" /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Icon (emoji)</label>
                    <input value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} className="input-field" placeholder="📚" /></div>
                  <div className="sm:col-span-2"><label className="text-sm text-gray-400 mb-1 block">Description</label>
                    <input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="input-field" placeholder="Short description..." /></div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" disabled={catSubmitting} className="btn-primary flex items-center gap-2">
                      {catSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      {editingCat ? "Save Changes" : "Add Category"}
                    </button>
                    <button type="button" onClick={() => setShowCatForm(false)} className="btn-secondary flex items-center gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <motion.div key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon || "📚"}</span>
                    <div>
                      <p className="font-bold text-white">{cat.name}</p>
                      {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
                      <p className="text-xs text-gray-500 mt-1">{cat.bookCount || 0} books</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCat(cat)} className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex items-center justify-center transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteCat(cat._id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}