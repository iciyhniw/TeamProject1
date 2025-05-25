import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import './styles/CommonFile.css'
import Profile from "./pages/Profile";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null); // 🔹 Додаємо стан користувача

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 🔄 оновлення користувача при вході/виході
    });

    return () => unsubscribe(); // очистка слухача
  }, []);
  return(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path= "/Profile" element={<Profile />} />
    </Routes>
  </Router>
);

export default App;
