'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import ProgressBar from '../MacrosProgress';
import Image from 'next/image';

export default function Step6() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    const { name, email, password } = form;

    if (!name || !email || password.length < 8) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    try {
      const responseSignup = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const dataSignup = await responseSignup.json();

      if (!responseSignup.ok) {
        setError(dataSignup.message || 'Erreur serveur.');
        return;
      }

      localStorage.setItem('userEmail', email);

      const step1Data = JSON.parse(localStorage.getItem('step1Data'));
      if (step1Data) {
        await fetch(`http://localhost:5000/api/profile/${email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(step1Data),
        });
      }

      localStorage.removeItem('step1Data');
      router.push('/dashboard');

    } catch (err) {
      console.error(err);
      setError('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.back} onClick={() => router.back()}>←</button>
          <ProgressBar currentStep={6} totalSteps={6} />
        </div>

        <h2 className={styles.title}>
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          &nbsp; Création du compte
        </h2>

        <div className={styles.form}>
          <label>Nom</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />

          <label>E-mail</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />

          <label>Mot de passe</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          <small>Minimum 8 caractères</small>

          {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
        </div>

        <button className={styles.next} onClick={handleNext}>Inscription</button>
      </div>
    </div>
  );
}
