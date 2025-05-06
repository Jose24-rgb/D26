import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Author from '../models/Author.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /login → ritorna un token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const author = await Author.findOne({ email }).select('+password');
  if (!author) return res.status(404).json({ error: 'Author not found' });

  const match = await bcrypt.compare(password, author.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: author._id, email: author.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// GET /me → ritorna l'autore autenticato
router.get('/me', authenticateToken, async (req, res) => {
  const author = await Author.findById(req.user.id);
  res.json(author);
});

export default router;
