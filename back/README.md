# Backend

Application avec : Node.js, Express, PostgreSQL, JWT et bcrypt.

-----------------------------------------------------------------

- Node.js   -- JavaScript pour le côté serveur
- Express   -- Framework
- PostgreSQL  -- Base de données 
- bcryptjs     -- Hasher les mot de passe
- jsonwebtoken -- Authentification via JWT
- dotenv      -- Gérer les variables d’environnement

-----------------------------------------------------------------

### Les dépendances

- npm install

- Créer un fichier `.env` 

### Démarrer le serveur back

- node server.js

-----------------------------------------------------------------

## 📬 Endpoints principaux

Méthode ------- URL  ----------- Description   
POST ------ `/api/signup` ------ Inscription                         
POST ------ `/api/login`  ------ Connexion et token JWT      
GET ------ `/api/profile/:email` ------ Récupérer le profil utilisateur / PUT Mettre à jour le profil 
    