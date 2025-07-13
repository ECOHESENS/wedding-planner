# 🚀 Guide de Déploiement Vercel

## Étapes de déploiement

### 1. Installer Vercel CLI
```bash
npm i -g vercel
```

### 2. Se connecter à Vercel
```bash
vercel login
# Suivez les instructions pour vous connecter
```

### 3. Créer une base de données PostgreSQL sur Vercel

**Via le Dashboard Vercel :**
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur l'onglet **Storage**
3. Cliquez sur **Create Database**
4. Choisissez **Postgres**
5. Nom : `wedding-planner-db`
6. Région : `Frankfurt (fra1)` (Europe)
7. Cliquez sur **Create**

### 4. Déployer le projet

```bash
# Aller dans le dossier du projet
cd wedding-planner

# Lancer le déploiement
vercel

# Choisir les options :
# ? Set up and deploy "wedding-planner"? [Y/n] y
# ? Which scope do you want to deploy to? [Votre compte]
# ? Link to existing project? [N/y] n
# ? What's your project's name? wedding-planner
# ? In which directory is your code located? ./
```

### 5. Connecter la base de données au projet

**Via le Dashboard Vercel :**
1. Allez dans votre projet déployé
2. Onglet **Settings** → **Environment Variables**
3. Cliquez sur **Connect Store** → Choisissez votre base PostgreSQL
4. Cela ajoutera automatiquement toutes les variables d'environnement

**Via CLI (alternative) :**
```bash
# Lier la base de données
vercel env pull .env.local

# Cela télécharge toutes les variables dans .env.local
```

### 6. Ajouter les variables NextAuth

```bash
# Générer une clé secrète
openssl rand -base64 32

# Ajouter la variable via le dashboard ou CLI
vercel env add NEXTAUTH_SECRET
# Entrez la clé générée ci-dessus

vercel env add NEXTAUTH_URL
# Entrez votre URL Vercel (ex: https://wedding-planner-xxx.vercel.app)
```

### 7. Redéployer avec les variables

```bash
vercel --prod
```

### 8. Initialiser la base de données

```bash
# Télécharger les variables d'environnement
vercel env pull .env.local

# Pousser le schema vers la base de production
npx prisma db push

# (Optionnel) Ajouter des données de test
npx tsx prisma/seed.ts
```

## ✅ Vérifications post-déploiement

1. **Tester l'application** : Visitez votre URL Vercel
2. **Tester l'authentification** : Créez un compte ou utilisez les comptes de test
3. **Vérifier la base de données** : Via le dashboard Vercel Storage

## 🔧 Commandes utiles

```bash
# Voir les logs
vercel logs

# Voir les variables d'environnement
vercel env ls

# Ouvrir le projet dans le navigateur
vercel open

# Redéployer rapidement
vercel --prod
```

## 🐛 Dépannage

### Erreur de base de données
```bash
# Régénérer le client Prisma
npx prisma generate

# Vérifier la connexion
npx prisma db push
```

### Erreur de build
```bash
# Tester localement avec les variables de prod
vercel env pull .env.local
npm run build
```

### Variables d'environnement manquantes
1. Vérifiez le dashboard Vercel → Settings → Environment Variables
2. Assurez-vous que `NEXTAUTH_SECRET` et `NEXTAUTH_URL` sont définis
3. Redéployez après avoir ajouté des variables

## 📊 Configuration automatique

Le projet est configuré avec :
- ✅ `vercel.json` optimisé
- ✅ Scripts Prisma automatiques
- ✅ Variables d'environnement documentées
- ✅ Build optimisé pour la production

## 🎯 URLs importantes

- **App déployée** : https://wedding-planner-xxx.vercel.app
- **Dashboard Vercel** : https://vercel.com/dashboard
- **Base de données** : Via Storage → wedding-planner-db

---

**Votre application est maintenant déployée et prête à être utilisée ! 🎉**