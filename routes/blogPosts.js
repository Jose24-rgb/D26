// routes/blogPosts.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import BlogPost from '../models/BlogPost.js';

const upload = multer({ storage });
const router = express.Router();

// GET /blogPosts → lista con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await BlogPost.find()
      .populate('author')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await BlogPost.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /blogPosts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /blogPosts
router.post('/', async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /blogPosts/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /blogPosts/:id
router.delete('/:id', async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /blogPosts/:id/cover → upload immagine copertina
router.patch('/:id/cover', upload.single('cover'), async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { cover: req.file.path },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


