import express from 'express';
import Author from '../models/Author.js';

const router = express.Router();

// GET /authors → ritorna la lista degli autori con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const authors = await Author.find()
      .limit(limit * 1) // Limita il numero di autori per pagina
      .skip((page - 1) * limit) // Salta i primi N autori in base alla pagina
      .exec();

    const count = await Author.countDocuments(); // Conta il totale degli autori

    res.json({
      authors,
      totalPages: Math.ceil(count / limit), // Calcola il numero totale di pagine
      currentPage: parseInt(page) // Paginazione corrente
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /authors/:id → ritorna un singolo autore in base all'id
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /authors → crea un nuovo autore
router.post('/', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /authors/:id → modifica un autore
router.put('/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /authors/:id → elimina un autore
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(204).send(); // Nessun contenuto
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


