import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const getErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Невірний формат email.';
    case 'auth/user-disabled':
      return 'Цей обліковий запис вимкнено.';
    case 'auth/user-not-found':
      return 'Користувача з таким email не знайдено.';
    case 'auth/wrong-password':
      return 'Невірний пароль.';
    case 'auth/invalid-credential':
      return 'Неправильний email або пароль.';
    default:
      return 'Сталася помилка. Спробуйте ще раз.';
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Вхід</h2>
      <input type="email" className="auth-input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} />
      {error && <p className="auth-error-message">{error}</p>}
      <button type="submit" className="login-button">Увійти</button>
    </form>
  );
};

export default LoginPage;
