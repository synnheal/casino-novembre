require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialiser Prisma (partagé avec le site casino)
const prisma = new PrismaClient();

// Créer le client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Collection des commandes
client.commands = new Collection();

// Charger les commandes
const commandsPath = path.join(__dirname, '../commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Commande chargée: ${command.data.name}`);
    } else {
      console.log(`⚠️ La commande ${file} n'a pas de "data" ou "execute"`);
    }
  }
}

// Event: Bot prêt
client.once('ready', () => {
  console.log('🤖 Bot connecté !');
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
  console.log(`📊 Serveurs: ${client.guilds.cache.size}`);
  console.log(`👥 Utilisateurs: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);
});

// Event: Interactions (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Commande inconnue: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, prisma);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution de ${interaction.commandName}:`, error);

    const errorMessage = {
      content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Gestion des erreurs
process.on('unhandledRejection', error => {
  console.error('❌ Unhandled promise rejection:', error);
});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN);

// Export pour utilisation
module.exports = { client, prisma };
