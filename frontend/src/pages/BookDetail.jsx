import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Edit2, Trash2, Calendar, User as UserIcon, BookOpen, Tag } from 'lucide-react';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { authAxios, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await authAxios.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError('Failed to fetch book details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await authAxios.delete(`/books/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || 'Book not found.'}
        </div>
      </div>
    );
  }

  const isCreator = book.createdBy?._id === user?._id || book.createdBy === user?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Explorer</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="md:flex">
          {/* Cover image (Left) */}
          <div className="md:w-1/3 bg-gray-50 flex justify-center p-6 border-b md:border-b-0 md:border-r border-gray-100">
            {book.coverImage ? (
              <div className="w-full max-w-[240px] rounded-lg overflow-hidden shadow-md">
                <img src={book.coverImage} alt={book.title} className="w-full h-auto object-cover" />
              </div>
            ) : (
              <div className="w-[200px] h-[280px] flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-400 rounded-lg p-4">
                <BookOpen className="h-16 w-16 mb-2 opacity-60" />
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                  No Cover
                </span>
              </div>
            )}
          </div>

          {/* Book Information (Right) */}
          <div className="p-8 md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-snug">{book.title}</h1>
              <p className="text-lg text-gray-600 font-medium mt-1">by {book.author}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4 border-y border-gray-100 py-3">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">Published:</span>
                  <span>{book.publishedYear}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">Contributor:</span>
                  <span>{book.createdBy?.name || 'Unknown'}</span>
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">About the Book</h3>
                <p className="mt-2 text-gray-650 leading-relaxed text-sm whitespace-pre-line">
                  {book.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            {isCreator && (
              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-100">
                <Link
                  to={`/edit-book/${book._id}`}
                  className="flex items-center space-x-2 bg-indigo-65 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Book</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-65 text-red-600 border border-red-250 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Book</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
