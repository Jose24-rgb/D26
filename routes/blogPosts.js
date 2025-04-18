import express from 'express';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

// GET /blogPosts → lista completa con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await BlogPost.find()
      .populate('author') // Popola i dettagli dell'autore
      .limit(limit * 1) // Limita il numero di post per pagina
      .skip((page - 1) * limit) // Salta i primi N post in base alla pagina
      .exec();

    const count = await BlogPost.countDocuments(); // Conta il totale dei post

    res.json({
      posts,
      totalPages: Math.ceil(count / limit), // Calcola il numero totale di pagine
      currentPage: parseInt(page) // Paginazione corrente
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /blogPosts/:id → ritorna un singolo blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /blogPosts → crea un nuovo blog post
router.post('/', async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /blogPosts/:id → modifica il blog post con l'id associato
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /blogPosts/:id → cancella il blog post con l'id associato
router.delete('/:id', async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

