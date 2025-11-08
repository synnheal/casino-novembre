# 🤖 Volt Casino Bot

Bot Discord pour le casino Volt.

## Installation

```bash
cd bot
npm install
```

## Configuration

1. Copier `.env.example` vers `.env`
2. Remplir les variables :
   - `DISCORD_TOKEN` : Token du bot Discord
   - `CLIENT_ID` : ID de l'application Discord
   - `DATABASE_URL` : Même URL que le site casino

## Lancer

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Commandes

Les commandes sont dans le dossier `commands/`.

## Base de données

Le bot utilise le même schéma Prisma que le site casino (`../prisma/schema.prisma`).

Pour générer le client Prisma :
```bash
cd ..
npx prisma generate
```
