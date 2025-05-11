'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la connexion');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Erreur réseau.');
    }
  };

  return (
    <div className={styles.container}>
  <div className={styles.left}>
    <img src="/logo.svg" alt="Logo" />
  </div>

  <div className={styles.right}>
    <div className={styles.card}>
      <h2 className={styles.title}>Connexion</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Mot de passe</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>CONNEXION</button>
      </form>
    </div>
  </div>
</div>
  );
}
