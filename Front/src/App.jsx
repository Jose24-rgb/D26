//Front/src/App.jsx
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const path = window.location.pathname;

  if (path === '/register') return <Register />;
  if (path === '/login') return <Login />;
  if (path === '/home') return <Home />;

  return (
    <div>
      <h1>Benvenuto!</h1>
      <a href="/register">Registrati</a> | <a href="/login">Login</a>
    </div>
  );
}

export default App;
