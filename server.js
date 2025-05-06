import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './db.js';
import authorsRouter from './routes/authors.js';
import blogPostsRouter from './routes/blogPosts.js';
import authRouter from './routes/auth.js';
import passport from 'passport';  // <--- Aggiungi passport
import session from 'express-session';  // Aggiungi session per Passport

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Route di base per testare il server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/', authRouter); // Login e /me (pubbliche)

// Middleware di autenticazione
app.use((req, res, next) => {
  if (req.path === '/login' || (req.path === '/authors' && req.method === 'POST')) return next();
  authenticateToken(req, res, next);
});

// Rotte protette
app.use('/authors', authorsRouter);
app.use('/blogPosts', blogPostsRouter);

// Connessione DB
connectDB();

// Avvio server
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});


