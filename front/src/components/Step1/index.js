'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';

export default function Step1() {
  const router = useRouter();
  const [form, setForm] = useState({
    gender: '',
    birthdate: '',
    weight: '',
    height: '',
    activity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const { gender, birthdate, weight, height, activity } = form;
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

    const bmr = gender === 'male'
      ? 10 * weightNum + 6.25 * heightNum - 5 * age + 5
      : 10 * weightNum + 6.25 * heightNum - 5 * age - 161;

    const activityFactor = activity === 'high' ? 1.6 : activity === 'medium' ? 1.4 : 1.2;
    const calories = Math.round(bmr * activityFactor);
    const protein = Math.round(weightNum * 1.5);
    const fat = Math.round(weightNum * 0.8);
    const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    const finalData = {
      ...form,
      calories,
      protein,
      fat,
      carbs,
    };

    localStorage.setItem('step1Data', JSON.stringify(finalData));
    router.push('/signup/step6');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Étape 1 - Informations utilisateur</h2>
      <input className={styles.input} name="gender" onChange={handleChange} placeholder="Homme ou femme" />
      <input className={styles.input} name="birthdate" onChange={handleChange} placeholder="Date de naissance" />
      <input className={styles.input} name="weight" onChange={handleChange} placeholder="Poids (kg)" />
      <input className={styles.input} name="height" onChange={handleChange} placeholder="Taille (cm)" />
      <input className={styles.input} name="activity" onChange={handleChange} placeholder="Niveau d'activité (low, medium, high)" />
      <button className={styles.button} onClick={handleNext}>Suivant</button>
    </div>
  );
}
