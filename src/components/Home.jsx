// src/components/Home.jsx
import { useEffect, useState } from 'react';
import api from '../api';

export default function Home() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get('/me');
      setMe(res.data);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Benvenuto!</h1>
      {me && <p>Ciao {me.nome} {me.cognome}</p>}
    </div>
  );
}
