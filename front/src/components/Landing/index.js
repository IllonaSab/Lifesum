'use client';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss';
import Image from 'next/image';

export default function Landing() {
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image src="/logo.svg" alt="LifeSum Logo" width={80} height={80} />
        </div>
        <h1 className={styles.title}>LA CLÉ D'UNE VIE SAINE ET ÉQUILIBRÉE</h1>
        <p className={styles.subtitle}>
          Optimisez votre alimentation pour atteindre vos objectifs personnels.
        </p>
        
        {/* Redirection vers la page d'inscription */}
        <button
           className={styles.primaryBtn}
           onClick={() => router.push('/signup/step1')}> 
           S'inscrire
        </button>
        
        <p className={styles.signInText}>Vous avez déjà un compte ?</p>
        
        {/* Redirection vers la page de connexion */}
        <button 
          className={styles.secondaryBtn}
          onClick={() => router.push('/login')}> 
          Se connecter
        </button>
      </div>
    </div>
  );
}
