import express from 'express';
import cors from 'cors'; // <-- Importa cors
import "dotenv/config";
import connectDB from './db.js';
import authorsRouter from './routes/authors.js';
import blogPostsRouter from './routes/blogPosts.js';

const app = express();

app.use(cors()); // <-- Usa cors
app.use(express.json());

// Route di base per testare il server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Rotte per gli autori
app.use('/authors', authorsRouter);

// Rotte per i blog posts
app.use('/blogPosts', blogPostsRouter);

// Inizializzazione della connessione a MongoDB
connectDB();

// Avvio del server
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

