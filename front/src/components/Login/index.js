'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';

export default function LoginForm() {
  // State pour stocker l'email et le mot de passe du formulaire
  const [form, setForm] = useState({ email: '', password: '' });

  // State pour afficher une erreur si la connexion échoue
  const [error, setError] = useState('');
  const router = useRouter();

  // Fonction déclenchée à chaque frappe dans un champ du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Met à jour le champ correspondant dans l'objet form
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction déclenchée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(''); // Réinitialise les erreurs

    try {
      // Envoie une requête POST à l'API de connexion
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // Si la réponse est en erreur, affiche le message
      if (!res.ok) {
        setError(data.message || 'Erreur lors de la connexion');
        return;
      }

      // Enregistre le token et l'email dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);

      // Redirige vers la page de dashboard après connexion
      router.push('/dashboard');
    } catch (err) {
      // Affiche une erreur si la requête échoue (problème réseau par ex.)
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
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

        // Affiche un message d'erreur si besoin
            {error && <p className={styles.error}>{error}</p>}

         // Bouton de soumission du formulaire 
            <button type="submit" className={styles.button}>CONNEXION</button>
          </form>
        </div>
      </div>
    </div>
  );
}
