//routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Author from '../models/Author.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// === LOGIN CON CREDENZIALI EMAIL/PASSWORD ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const author = await Author.findOne({ email }).select('+password');
  if (!author) return res.status(404).json({ error: 'Author not found' });

  const match = await bcrypt.compare(password, author.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: author._id, email: author.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// === LOGIN CON GOOGLE OAUTH ===
// Endpoint per il login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Callback di Google per la gestione del risultato
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const { token, author } = req.user;
  res.json({ token, author });
});

// === OTTIENI DATI DELL'UTENTE AUTENTICATO ===
router.get('/me', authenticateToken, async (req, res) => {
  const author = await Author.findById(req.user.id);
  res.json(author);
});

export default router;

