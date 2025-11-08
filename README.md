# ⚡ Volt Casino - Monorepo Complet

> Casino en ligne + Bot Discord avec base de données partagée

---

## 📁 Structure du projet

```
casino-novembre/
├── src/                    # 🎰 Site casino (Next.js)
│   ├── app/               # Pages et routes API
│   ├── components/        # Composants React
│   └── lib/              # Utilitaires
├── bot/                   # 🤖 Bot Discord
│   ├── src/              # Code du bot
│   ├── commands/         # Commandes Discord
│   └── package.json      # Dépendances du bot
├── prisma/               # 🗄️ Base de données partagée
│   └── schema.prisma     # Schéma Prisma
├── package.json          # Dépendances du site
└── README.md            # Ce fichier
```

---

## 🎮 Fonctionnalités

### 🎰 Site Casino (Next.js)
- ✅ **4 jeux fonctionnels** : Crash, Plinko, Blackjack, Slots
- ✅ Authentification Discord OAuth
- ✅ Système de crédits
- ✅ Dashboard personnalisé
- ✅ Historique des parties
- ✅ Statistiques des joueurs

### 🤖 Bot Discord
- ✅ Commande `/balance` - Voir son solde
- ✅ Commande `/stats` - Voir ses statistiques
- ✅ Synchronisé avec le site (même BDD)

---

## 🚀 Installation Locale

### 1. Cloner le projet

```bash
git clone https://github.com/synnheal/casino-novembre.git
cd casino-novembre
git checkout claude/fix-site-errors-011CUhsSYddnE46Upj2xDpzt
```

### 2. Installer les dépendances

**Site casino :**
```bash
npm install
```

**Bot Discord :**
```bash
cd bot
npm install
cd ..
```

### 3. Configuration

#### **`.env` à la racine (pour le site) :**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="ton_secret_jwt"
DISCORD_CLIENT_ID="ton_client_id"
DISCORD_CLIENT_SECRET="ton_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/callback"
NEXTAUTH_SECRET="ton_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### **`bot/.env` (pour le bot) :**
```env
DISCORD_TOKEN="ton_token_bot"
CLIENT_ID="ton_client_id"
DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV=development
```

⚠️ **IMPORTANT :** Les deux `.env` doivent avoir la **MÊME** `DATABASE_URL` !

### 4. Setup de la base de données

```bash
npx prisma generate
npx prisma db push
```

### 5. Lancer le projet

**Terminal 1 - Site casino :**
```bash
npm run dev
```
→ Accès : http://localhost:3000

**Terminal 2 - Bot Discord :**
```bash
cd bot
node deploy-commands.js  # Déployer les slash commands
npm run dev
```

---

## 🌐 Déploiement Production

### Site Casino sur Pterodactyl

```bash
# 1. Cloner
git clone https://github.com/synnheal/casino-novembre.git .
git checkout claude/fix-site-errors-011CUhsSYddnE46Upj2xDpzt

# 2. Créer .env de production

# 3. Startup command
npm install && npx prisma generate && npm run build && npm start
```

**Port :** `8006`

### Bot Discord sur un VPS/Serveur

```bash
# 1. Accéder au dossier bot
cd bot

# 2. Créer .env de production

# 3. Installer et déployer les commandes
npm install
node deploy-commands.js

# 4. Lancer avec PM2 (recommandé)
pm2 start src/index.js --name "volt-casino-bot"
pm2 save
pm2 startup
```

---

## 🗄️ Base de Données

### Alternatives gratuites à Railway

- **Supabase** (recommandé) : https://supabase.com
- **Neon** : https://neon.tech
- **CockroachDB** : https://cockroachlabs.com

### Migration

```bash
# Exporter depuis Railway
pg_dump "postgresql://old_url" > backup.sql

# Importer vers nouvelle BDD
psql "postgresql://new_url" < backup.sql

# Mettre à jour les .env
DATABASE_URL="postgresql://new_url"
```

---

## 📝 Scripts disponibles

### Site Casino

| Commande | Description |
|----------|-------------|
| `npm run dev` | Mode développement (port 3000) |
| `npm run build` | Build production |
| `npm start` | Lancer en production (port 8006) |

### Bot Discord

| Commande | Description |
|----------|-------------|
| `npm run dev` | Mode développement avec nodemon |
| `npm start` | Lancer le bot |
| `node deploy-commands.js` | Déployer les slash commands |

---

## 🛠️ Technologies

### Frontend
- **Next.js 15** - Framework React
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Matter.js** - Physique (Plinko)

### Backend
- **Next.js API Routes** - Routes API
- **Prisma** - ORM base de données
- **PostgreSQL** - Base de données
- **Discord.js v14** - Bot Discord

### Auth
- **Discord OAuth** - Authentification
- **JWT** - Tokens

---

## 🔧 Développement

### Ajouter un jeu au site

1. Créer `src/app/games/[nom-jeu]/page.tsx`
2. Créer `src/app/games/[nom-jeu]/[NomJeu]GameClient.tsx`
3. Créer les routes API dans `src/app/api/[nom-jeu]/`
4. Ajouter au dashboard

### Ajouter une commande au bot

1. Créer `bot/commands/[nom-commande].js`
2. Structure :
```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nom-commande')
    .setDescription('Description'),

  async execute(interaction, prisma) {
    // Code ici
  }
};
```
3. Redéployer : `node bot/deploy-commands.js`

---

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

---

## 📄 License

MIT

---

## 🆘 Support

- **Issues :** https://github.com/synnheal/casino-novembre/issues
- **Discord :** [Lien ton serveur Discord]

---

**Développé avec ⚡ par la communauté Volt**
