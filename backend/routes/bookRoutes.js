const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// @desc    Get all books with optional search and category filters
// @route   GET /api/books
router.get('/', protect, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Get single book details
// @route   GET /api/books/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new book
// @route   POST /api/books
router.post('/', protect, upload.single('coverImage'), async (req, res) => {
  const { title, author, category, publishedYear, description } = req.body;

  try {
    const coverImage = req.file ? req.file.path : '';

    const book = new Book({
      title,
      author,
      category,
      publishedYear: Number(publishedYear),
      description,
      coverImage,
      createdBy: req.user._id,
    });

    const createdBook = await book.save();
    return res.status(201).json(createdBook);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Update a book
// @route   PUT /api/books/:id
router.put('/:id', protect, upload.single('coverImage'), async (req, res) => {
  const { title, author, category, publishedYear, description } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only creator can update
    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'User not authorized to update this book' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.publishedYear = publishedYear
      ? Number(publishedYear)
      : book.publishedYear;
    book.description = description || book.description;

    if (req.file) {
      book.coverImage = req.file.path;
    }

    const updatedBook = await book.save();
    return res.json(updatedBook);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Only creator can delete
    if (book.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: 'User not authorized to delete this book' });
    }

    await book.deleteOne();
    return res.json({ message: 'Book removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
