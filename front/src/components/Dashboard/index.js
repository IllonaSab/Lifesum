// src/components/Dashboard/index.js
'use client';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [macros, setMacros] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [meals, setMeals] = useState([
    { label: 'Petit déjeuner', img: '/breakfast.png', food: '', calories: 0 },
    { label: 'Déjeuner', img: '/lunch.png', food: '', calories: 0 },
    { label: 'Dîner', img: '/dinner.png', food: '', calories: 0 },
    { label: 'Goûter', img: '/snack.png', food: '', calories: 0 },
    { label: 'Eau', img: '/water.png', food: '', calories: 0 },
  ]);

  const foodDatabase = {
    banane: 89,
    pomme: 52,
    riz: 130,
    poulet: 165,
    oeuf: 68,
    pain: 265,
    yaourt: 59,
    chocolat: 40,
    brocoli: 55,
    carotte: 41,
    steak: 271,
    poisson: 206,
    avocat: 160,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) return;

      try {
        const res = await fetch(`http://localhost:5000/api/profile/${email}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setMacros(calculateMacros(data.user));
        }
      } catch (err) {
        console.error('Erreur de chargement :', err);
      }
    };

    fetchUser();
  }, []);

  const calculateMacros = (user) => {
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const age = new Date().getFullYear() - new Date(user.birthdate).getFullYear();
    const gender = user.gender;

    const bmr = gender === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5;

    const calories = Math.round(bmr * 1.55);
    return {
      calories,
      protein: Math.round(weight * 1.8),
      carbs: Math.round((calories * 0.4) / 4),
      fat: Math.round((calories * 0.3) / 9),
    };
  };

  const handleFoodChange = (e, idx) => {
  const input = e.target.value.toLowerCase();
  const items = input.split(',').map(item => item.trim());
  
  const totalCalories = items.reduce((sum, item) => {
    return sum + (foodDatabase[item] || 0);
  }, 0);

  const updatedMeals = [...meals];
  updatedMeals[idx].food = input;
  updatedMeals[idx].calories = totalCalories;
  setMeals(updatedMeals);

  const total = updatedMeals.reduce((acc, m) => acc + m.calories, 0);
  setConsumedCalories(total);
};

  if (!user || !macros) return <div>Chargement...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.stat}>
          <div>{consumedCalories}</div>
          <div>Consommées</div>
        </div>

        <div className={styles.center}>
          <div className={styles.kcal}>{macros.calories - consumedCalories}</div>
          <div className={styles.label}>KCAL RESTANTES</div>
        </div>

        <div className={styles.stat}>
          <div>0</div>
          <div>Brulées</div>
        </div>
      </div>

      <div className={styles.macros}>
        <div>
          <div>Glucides</div>
          <div>{macros.carbs} g</div>
        </div>
        <div>
          <div>Protéines</div>
          <div>{macros.protein} g</div>
        </div>
        <div>
          <div>Lipides</div>
          <div>{macros.fat} g</div>
        </div>
      </div>

      <div className={styles.date}>11 Mai 2025</div>

      <div className={styles.mealList}>
        {meals.map((meal, idx) => (
          <div key={idx} className={styles.mealCard}>
            <div className={styles.left}>
              <Image src={meal.img} alt={meal.label} width={40} height={40} />
              <div className={styles.info}>
                <h4>{meal.label}</h4>
                <p>{meal.calories > 0 ? `${meal.food} - ${meal.calories} Kcal` : 'Aucune valeur'}</p>
              </div>
            </div>
            <input
              placeholder="Ajouter un aliment"
              type="text"
              value={meal.food}
              onChange={(e) => handleFoodChange(e, idx)}
              className={styles.foodInput}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
