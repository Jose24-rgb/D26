// Front/src/components/AddPost.jsx
import { useState } from 'react';
import api from '../api';

export default function AddPost({ authorId }) {
  const [form, setForm] = useState({
    category: '',
    title: '',
    readTimeValue: '',
    readTimeUnit: '',
    content: '',
    cover: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, cover: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('category', form.category);
    data.append('title', form.title);
    data.append('readTime[value]', form.readTimeValue);
    data.append('readTime[unit]', form.readTimeUnit);
    data.append('content', form.content);
    data.append('author', authorId);
    if (form.cover) data.append('cover', form.cover);

    try {
      const res = await api.post('/blogPosts', data);
      alert("Articolo pubblicato con successo!");
      console.log(res.data);
    } catch (err) {
      alert("Errore durante la pubblicazione");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Titolo" onChange={handleChange} />
      <input name="category" placeholder="Categoria" onChange={handleChange} />
      <input name="readTimeValue" placeholder="Tempo di lettura (valore)" onChange={handleChange} />
      <input name="readTimeUnit" placeholder="Tempo di lettura (unità)" onChange={handleChange} />
      <textarea name="content" placeholder="Contenuto" onChange={handleChange}></textarea>
      <input type="file" name="cover" onChange={handleFileChange} />
      <button type="submit">Pubblica</button>
    </form>
  );
}
