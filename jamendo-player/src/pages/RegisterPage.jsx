import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Цей email вже зареєстрований.';
      case 'auth/invalid-email':
        return 'Невірний формат email.';
      case 'auth/operation-not-allowed':
        return 'Реєстрація наразі недоступна.';
      case 'auth/weak-password':
        return 'Пароль має містити щонайменше 6 символів.';
      default:
        return 'Сталася помилка. Спробуйте ще раз.';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Реєстрація</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" onChange={e => setPassword(e.target.value)} />
      {error && <p className="auth-error-message">{error}</p>}
      <button type="submit" className="register-button">Зареєструватися</button>
    </form>
  );
};

export default RegisterPage;
