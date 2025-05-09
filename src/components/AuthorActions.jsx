// src/components/AuthorActions.jsx
import { useState } from 'react';
import api from '../api';

export default function AuthorActions({ authorId }) {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/authors/${authorId}`, form);
      alert('Autore aggiornato');
      console.log(res.data);
    } catch (err) {
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare il tuo profilo?')) return;
    try {
      await api.delete(`/authors/${authorId}`);
      alert('Autore eliminato');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      alert('Errore durante la cancellazione');
    }
  };

  return (
    <div>
      <h3>Modifica autore</h3>
      <input name="nome" placeholder="Nuovo nome" onChange={handleChange} />
      <input name="cognome" placeholder="Nuovo cognome" onChange={handleChange} />
      <button onClick={handleUpdate}>Salva modifiche</button>
      <hr />
      <button onClick={handleDelete} style={{ color: 'red' }}>Elimina il mio profilo</button>
    </div>
  );
}

