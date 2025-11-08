const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Voir tes statistiques de jeu'),

  async execute(interaction, prisma) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Récupérer l'utilisateur et ses stats
      const user = await prisma.user.findUnique({
        where: { discordId: interaction.user.id },
        include: {
          casinoStats: true,
          casinoGames: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        return interaction.editReply({
          content: '❌ Tu n\'es pas encore enregistré ! Connecte-toi sur le site casino.',
        });
      }

      const stats = user.casinoStats;

      // Calculer le profit/perte
      const totalWagered = stats?.totalWagered || BigInt(0);
      const totalWon = stats?.totalWon || BigInt(0);
      const profit = totalWon - totalWagered;

      // Créer l'embed
      const embed = new EmbedBuilder()
        .setColor('#00D9C0')
        .setTitle('📊 Tes statistiques')
        .setDescription(`Stats de **${user.username}**`)
        .addFields(
          { name: '💎 Crédits actuels', value: `${user.credits.toString()} 💰`, inline: true },
          { name: '🎮 Parties jouées', value: `${stats?.totalGames || 0}`, inline: true },
          { name: '🎯 Niveau', value: `${stats?.level || 1}`, inline: true },
          { name: '💰 Total misé', value: `${totalWagered.toString()} 💰`, inline: true },
          { name: '🏆 Total gagné', value: `${totalWon.toString()} 💰`, inline: true },
          { name: `${profit >= 0 ? '📈' : '📉'} Profit/Perte`, value: `${profit >= 0 ? '+' : ''}${profit.toString()} 💰`, inline: true },
          { name: '💥 Plus gros gain', value: `${stats?.biggestWin.toString() || '0'} 💰`, inline: true },
          { name: '⭐ XP', value: `${stats?.xp || 0}`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'Volt Casino' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur stats:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la récupération de tes stats.',
      });
    }
  },
};
