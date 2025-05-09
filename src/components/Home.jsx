// src/components/Home.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import AuthorActions from './AuthorActions';


export default function Home() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
  
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState(null, '', '/home'); // rimuove ?token=... dall'URL
    }
  
    const fetchUser = async () => {
      const res = await api.get('/me');
      setMe(res.data);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Benvenuto!</h1>
      {me && (
        <>
          <p>Ciao {me.nome} {me.cognome}</p>
          <AuthorActions authorId={me._id} />
        </>
      )}
    </div>
  );
  
}
