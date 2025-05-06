// src/config/passportConfig.js
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import Author from '../models/Author.js'; // Modifica il percorso se necessario
import jwt from 'jsonwebtoken';

// Configura la Google Strategy per Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica se l'autore esiste già nel DB
        let author = await Author.findOne({ email: profile.emails[0].value });

        if (!author) {
          // Se non esiste, crea un nuovo autore
          author = new Author({
            nome: profile.name.givenName,
            cognome: profile.name.familyName,
            email: profile.emails[0].value,
            password: '', // Vuoto in caso di login con Google
          });

          await author.save();
        }

        // Genera un JWT
        const token = jwt.sign({ id: author._id, email: author.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        done(null, { token, author });
      } catch (err) {
        done(err);
      }
    }
  )
);

// Serializzazione dell'utente (puoi personalizzare)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializzazione dell'utente
passport.deserializeUser((user, done) => {
  done(null, user);
});
