'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';

export default function Step1() {
  const router = useRouter(); 

  // State local pour stocker les données saisies par l'utilisateur
  const [form, setForm] = useState({
    gender: '',       // Sexe : "male" ou "female"
    birthdate: '',    // Date de naissance (format ISO)
    weight: '',       // Poids en kg
    height: '',       // Taille en cm
    activity: ''      // Niveau d’activité : "low", "medium", "high"
  });

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Met à jour dynamiquement le champ correspondant dans le state
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Fonction appelée lors du clic sur le bouton "Suivant"
  const handleNext = () => {
    const { gender, birthdate, weight, height, activity } = form;

    // Conversion des champs poids et taille en nombres
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Calcul de l’âge à partir de la date de naissance
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

    // Calcul du métabolisme de base (BMR) selon le sexe
    const bmr = gender === 'male'
      ? 10 * weightNum + 6.25 * heightNum - 5 * age + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * age - 161;

    // Facteur d’activité physique (influence sur les calories de maintenance)
    const activityFactor =
      activity === 'high' ? 1.6 :
      activity === 'medium' ? 1.4 :
      1.2;

    // Calcul des besoins journaliers
    const calories = Math.round(bmr * activityFactor);
    const protein = Math.round(weightNum * 1.5); // Protéines : 1.5g/kg
    const fat = Math.round(weightNum * 0.8);     // Lipides : 0.8g/kg

    // Calcul des glucides restants une fois protéines et lipides déduits (4 kcal/g pour prot/glucides, 9 kcal/g pour lipides)
    const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    // Compilation des données finales
    const finalData = {
      ...form,        // Données saisies
      calories,       // Apport calorique estimé
      protein,        // Besoin en protéines
      fat,            // Besoin en lipides
      carbs           // Besoin en glucides
    };

    // Stockage temporaire des données dans le localStorage
    localStorage.setItem('step1Data', JSON.stringify(finalData));

    // Redirection vers l’étape 6 du formulaire
    router.push('/signup/step6');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Étape 1 - Informations utilisateur</h2>

      {/* Champs de formulaire liés à chaque info */}
      <input
        className={styles.input}
        name="gender"
        onChange={handleChange}
        placeholder="Homme ou femme"
      />

      <input
        className={styles.input}
        name="birthdate"
        onChange={handleChange}
        placeholder="Date de naissance"
      />

      <input
        className={styles.input}
        name="weight"
        onChange={handleChange}
        placeholder="Poids (kg)"
      />

      <input
        className={styles.input}
        name="height"
        onChange={handleChange}
        placeholder="Taille (cm)"
      />

      <input
        className={styles.input}
        name="activity"
        onChange={handleChange}
        placeholder="Niveau d'activité (low, medium, high)"
      />

      {/* Bouton de validation pour passer à l'étape suivante */}
      <button
        className={styles.button}
        onClick={handleNext}
      >
        Suivant
      </button>
    </div>
  );
}
