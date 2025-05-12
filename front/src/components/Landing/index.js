'use client'; 
import { useRouter } from 'next/navigation'; 


import styles from './index.module.scss'; // Importation SCSS
import Image from 'next/image';

export default function Landing() {
  const router = useRouter();  // Initialisation du router pour effectuer des redirections côté client 

  return (
    <div className={styles.container}> //Conteneur principal
      <div className={styles.card}> //Carte principale contenant le contenu de la landing page 
        <div className={styles.logo}> //Zone du logo 
          <Image src="/logo.svg" alt="LifeSum Logo" width={80} height={80} />
        </div>

        <h1 className={styles.title}>
          LA CLÉ D'UNE VIE SAINE ET ÉQUILIBRÉE
        </h1>
        <p className={styles.subtitle}>
          Optimisez votre alimentation pour atteindre vos objectifs personnels.
        </p>
        <button  // Bouton principal : redirige vers la première étape du formulaire d'inscription
          className={styles.primaryBtn}
          onClick={() => router.push('/signup/step1')} 
        > 
          S'inscrire
        </button>

// Texte incitatif pour les utilisateurs déjà inscrits 
        <p className={styles.signInText}>Vous avez déjà un compte ?</p>

// Bouton secondaire : redirige vers la page de connexion 
        <button 
          className={styles.secondaryBtn}
          onClick={() => router.push('/login')} 
        > 
          Se connecter
        </button>
      </div>
    </div>
  );
}
