const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Permet de déconnecter le bot")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    async execute(client, interaction) {
        
        await interaction.deferReply({ephemeral: true})

        await interaction.client.player.destroy()

        await interaction.followUp(`La musique à été arrêté par ${interaction.user}`)
    }
}
