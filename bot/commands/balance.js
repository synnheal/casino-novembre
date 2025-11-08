const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Voir ton solde de crédits'),

  async execute(interaction, prisma) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Récupérer l'utilisateur depuis la BDD
      const user = await prisma.user.findUnique({
        where: { discordId: interaction.user.id },
        include: { casinoStats: true }
      });

      if (!user) {
        return interaction.editReply({
          content: '❌ Tu n\'es pas encore enregistré ! Connecte-toi sur le site casino pour créer ton compte.',
        });
      }

      // Créer l'embed
      const embed = new EmbedBuilder()
        .setColor('#00D9C0')
        .setTitle('💰 Ton solde')
        .setDescription(`Bonjour **${user.username}** !`)
        .addFields(
          { name: '💎 Crédits', value: `**${user.credits.toString()}** 💰`, inline: true },
          { name: '🎮 Parties jouées', value: `${user.casinoStats?.totalGames || 0}`, inline: true },
          { name: '🏆 Plus gros gain', value: `${user.casinoStats?.biggestWin.toString() || '0'} 💰`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'Volt Casino' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur balance:', error);
      await interaction.editReply({
        content: '❌ Une erreur est survenue lors de la récupération de ton solde.',
      });
    }
  },
};
