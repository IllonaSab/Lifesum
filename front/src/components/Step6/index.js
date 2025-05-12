'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';

export default function Step6() {
  const router = useRouter(); 

  // State pour stocker les infos du formulaire d'inscription
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // State pour afficher un message d'erreur si quelque chose échoue
  const [error, setError] = useState('');

  // Fonction appelée à chaque modification de champ
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Met à jour dynamiquement le champ correspondant
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Fonction exécutée lors du clic sur le bouton "Inscription"
  const handleNext = async () => {
    const { name, email, password } = form;

    // Vérifie que tous les champs sont remplis correctement
    if (!name || !email || password.length < 8) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    try {
      // Envoie la requête POST pour créer le compte utilisateur
      const responseSignup = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const dataSignup = await responseSignup.json();

      // Si l'inscription échoue, on affiche l'erreur retournée
      if (!responseSignup.ok) {
        setError(dataSignup.message || 'Erreur serveur.');
        return;
      }

      // Sauvegarde l'e-mail pour l’utiliser après
      localStorage.setItem('userEmail', email);

      // Récupère les données saisies dans l'étape 1 (profil nutritionnel)
      const step1Data = JSON.parse(localStorage.getItem('step1Data'));

      // Si elles existent, envoie une requête PUT pour compléter le profil utilisateur
      if (step1Data) {
        await fetch(`http://localhost:5000/api/profile/${email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(step1Data),
        });
      }

      // Supprime les données temporaires de l'étape 1
      localStorage.removeItem('step1Data');

      // Redirige l’utilisateur vers le dashboard
      router.push('/dashboard');

    } catch (err) {
      // En cas d’erreur réseau (API inaccessible, etc.)
      console.error(err);
      setError('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          {/* Bouton pour revenir à la page précédente */}
          <button className={styles.back} onClick={() => router.back()}>←</button>
        </div>

        {/* Titre de la carte avec logo */}
        <h2 className={styles.title}>
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          &nbsp; Création du compte
        </h2>

        {/* Formulaire d’inscription */}
        <div className={styles.form}>
          <label>Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <small>Minimum 8 caractères</small>

          {/* Affiche une erreur si besoin */}
          {error && (
            <p style={{ color: 'red', fontSize: '0.85rem' }}>
              {error}
            </p>
          )}
        </div>

        {/* Bouton de soumission de l'inscription */}
        <button className={styles.next} onClick={handleNext}>
          Inscription
        </button>
      </div>
    </div>
  );
}
