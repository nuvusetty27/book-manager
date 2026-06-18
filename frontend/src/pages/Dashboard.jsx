import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, BookOpen, Eye, Edit2, Trash2, Calendar, User as UserIcon } from 'lucide-react';

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography', 'History', 'Mystery', 'Other'];

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { authAxios, user } = useContext(AuthContext);

  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/books';
      const params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (selectedCategory && selectedCategory !== 'All') {
        params.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await authAxios.get(url);
      setBooks(res.data);
    } catch (err) {
      setError('Error fetching books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await authAxios.delete(`/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search/Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book Explorer</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and explore your digital library shelf.</p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Filter className="h-5 w-5" />
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-150">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No books found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new book card.</p>
          <div className="mt-6">
            <Link
              to="/add-book"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Book
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const isCreator = book.createdBy?._id === user?._id || book.createdBy === user?._id;

            return (
              <div
                key={book._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-250 transition flex flex-col h-full"
              >
                {/* Cover Image Container */}
                <div className="relative pb-[120%] bg-gray-100 flex-shrink-0">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-400 p-4">
                      <BookOpen className="h-12 w-12 mb-2 opacity-60" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                        No Cover Available
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shadow">
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 line-clamp-1" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">by {book.author}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{book.publishedYear}</span>
                      </span>
                      <span className="flex items-center space-x-1 truncate max-w-[120px]">
                        <UserIcon className="h-3 w-3" />
                        <span className="truncate">{book.createdBy?.name || 'Unknown'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                    <Link
                      to={`/books/${book._id}`}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-600 hover:text-indigo-600 transition"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>

                    {isCreator && (
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/edit-book/${book._id}`}
                          className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="flex items-center space-x-1 text-xs font-medium text-red-600 hover:text-red-700 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
