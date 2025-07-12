# Wedding Planner App 💒

Une application complète pour organiser des mariages avec prise en compte des traditions marocaines, tunisiennes et algériennes.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Docker Desktop
- npm ou yarn

### Installation

1. **Cloner le projet et installer les dépendances**
```bash
npm install
```

2. **Démarrer la base de données**
```bash
docker compose up -d
```

3. **Configurer la base de données**
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

4. **Démarrer l'application**
```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de données

### Gestion avec Docker

**Démarrer la base de données:**
```bash
docker compose up -d
```

**Arrêter la base de données:**
```bash
docker compose down
```

**Voir les logs:**
```bash
docker compose logs postgres
```

**Accéder à Adminer (interface web):**
- URL: [http://localhost:8080](http://localhost:8080)
- Système: PostgreSQL
- Serveur: postgres
- Utilisateur: wedding_user
- Mot de passe: wedding_password
- Base de données: wedding_planner

### Commandes Prisma utiles

**Réinitialiser la base de données:**
```bash
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

**Générer le client Prisma:**
```bash
npx prisma generate
```

**Ouvrir Prisma Studio:**
```bash
npx prisma studio
```

## 👥 Comptes de test

Après avoir exécuté le seed script, vous pouvez utiliser ces comptes :

**Wedding Planner:**
- Email: `planner@wedding.com`
- Mot de passe: `planner123`

**Mariée:**
- Email: `bride@example.com`
- Mot de passe: `couple123`

**Marié:**
- Email: `groom@example.com`
- Mot de passe: `couple123`

## 🏗️ Architecture

### Technologies utilisées
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de données:** PostgreSQL avec Prisma ORM
- **Authentification:** NextAuth.js
- **Conteneurisation:** Docker

### Structure du projet
```
src/
├── app/                    # Pages et API routes (App Router)
│   ├── api/               # API endpoints
│   ├── auth/              # Pages d'authentification
│   └── dashboard/         # Dashboard principal
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
└── types/                 # Types TypeScript

prisma/
├── schema.prisma          # Schéma de base de données
└── seed.ts               # Données d'exemple
```

## 🎯 Fonctionnalités

### ✅ Implémentées (MVP)
- ✅ Authentification utilisateurs (couples + wedding planners)
- ✅ Base de données avec schéma complet
- ✅ Pages d'accueil et dashboard
- ✅ Support multi-culturel (Maroc, Tunisie, Algérie)

### 🔄 En développement
- 🔄 Profils de couples avec préférences culturelles
- 🔄 Checklists personnalisées par événement
- 🔄 Gestion du budget par poste
- 🔄 Timeline et calendrier des événements
- 🔄 Upload et gestion de documents
- 🔄 Dashboard wedding planner multi-clients
- 🔄 Système de messagerie

### 🔮 Fonctionnalités futures
- 🔮 Gestion du trousseau
- 🔮 Encyclopédie des traditions
- 🔮 Générateur d'invitations
- 🔮 Gestion des invités et placement
- 🔮 Intégrations prestataires

## 🛠️ Développement

### Variables d'environnement
Créer un fichier `.env.local` pour les variables de développement :

```env
# Pour la production, changer ces valeurs
NEXTAUTH_SECRET="your-super-secret-key-for-production"
NEXTAUTH_URL="http://localhost:3000"

# Upload de fichiers
UPLOAD_DIR="./public/uploads"
```

### Scripts npm

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Build pour la production
npm run start        # Démarrer en mode production
npm run lint         # Linter le code
npm run type-check   # Vérifier les types TypeScript
```

## 📝 Notes importantes

1. **Docker** : Assurez-vous que Docker Desktop est démarré avant de lancer `docker compose up -d`

2. **Base de données** : Les données sont persistées dans un volume Docker, elles survivront aux redémarrages

3. **Développement** : Utilisez Adminer ou Prisma Studio pour explorer la base de données pendant le développement

4. **Production** : Pensez à changer les mots de passe et secrets pour la production
