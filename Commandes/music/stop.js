const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Permet de déconnecter le bot")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    async execute(client, interaction) {
        
        await interaction.deferReply({ephemeral: true})

        const queue = interaction.client.player.nodes.get(interaction.guild)

        await queue.delete()

        await interaction.followUp(`La musique à été arrêté par ${interaction.user}`)
    }
}
