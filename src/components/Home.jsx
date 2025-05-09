// src/components/Home.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import AuthorActions from './AuthorActions';
import AddPost from './AddPost';

export default function Home() {
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState(null, '', '/home');
    }

    const fetchUser = async () => {
      const res = await api.get('/me');
      setMe(res.data);
    };

    const fetchPosts = async () => {
      const res = await api.get('/blogPosts');
      setPosts(res.data.posts);
    };

    fetchUser();
    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/blogPosts?title=${search}`);
      setPosts(res.data.posts);
    } catch (err) {
      alert("Errore nella ricerca");
    }
  };

  return (
    <div>
      <h1>Benvenuto!</h1>

      {me && (
        <>
          <p>Ciao {me.nome} {me.cognome}</p>
          <AuthorActions authorId={me._id} />
          <AddPost authorId={me._id} />
        </>
      )}

      <h2>Articoli</h2>

      <div>
        <input
          placeholder="Cerca per titolo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Cerca</button>
      </div>

      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.category} • {post.readTime.value} {post.readTime.unit}</p>
          <img src={post.cover} alt="cover" width={200} />
          <p>{post.content.substring(0, 100)}...</p>
          <hr />
        </div>
      ))}
    </div>
  );
}


