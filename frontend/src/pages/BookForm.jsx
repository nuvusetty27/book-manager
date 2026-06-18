import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'History', 'Mystery', 'Other'];

const BookForm = () => {
  const { id } = useParams(); // populated if editing
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [publishedYear, setPublishedYear] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const { authAxios } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        setFetching(true);
        setError('');
        try {
          const res = await authAxios.get(`/books/${id}`);
          const book = res.data;
          setTitle(book.title);
          setAuthor(book.author);
          setCategory(book.category);
          setPublishedYear(book.publishedYear);
          setDescription(book.description || '');
          if (book.coverImage) {
            setImagePreview(book.coverImage);
          }
        } catch (err) {
          setError('Could not load the book details.');
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('publishedYear', publishedYear);
    formData.append('description', description);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      if (isEditMode) {
        await authAxios.put(`/books/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await authAxios.post('/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving the book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Book Details' : 'Add New Book to Shelf'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column (Inputs) */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-305 rounded-lg px-3 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. The Great Gatsby"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border border-gray-305 rounded-lg px-3 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="e.g. F. Scott Fitzgerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-305 rounded-lg px-3 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Published Year *</label>
                  <input
                    type="number"
                    required
                    value={publishedYear}
                    onChange={(e) => setPublishedYear(e.target.value)}
                    className="w-full border border-gray-305 rounded-lg px-3 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="e.g. 1925"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-305 rounded-lg px-3 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Write a brief overview of the book..."
                />
              </div>
            </div>

            {/* Right Column (Image Upload) */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <span className="block text-sm font-medium text-gray-700 mb-3 self-start">Cover Image</span>
              {imagePreview ? (
                <div className="relative w-48 h-64 mb-4 rounded-lg overflow-hidden shadow-md">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-48 h-64 mb-4 flex flex-col items-center justify-center bg-gray-150 text-gray-400 rounded-lg">
                  <Upload className="h-10 w-10 mb-2" />
                  <span className="text-xs">No Cover Image Chosen</span>
                </div>
              )}

              <label className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 shadow-sm transition">
                <span>Upload a file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-1.5 text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {loading ? 'Saving Changes...' : isEditMode ? 'Save Changes' : 'Create Book Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
