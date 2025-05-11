import { useState } from 'react';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    dataDiNascita: '',
    password: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/authors', form);
    alert("Registrazione completata, ora fai il login.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" placeholder="Nome" onChange={handleChange} />
      <input name="cognome" placeholder="Cognome" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="dataDiNascita" placeholder="Data di nascita" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Registrati</button>
    </form>
  );
}
