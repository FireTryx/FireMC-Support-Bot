const { SlashCommandBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Permet de jouer une musique")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option.setName("musique").setDescription("Quelle est le titre de la musiqe ?").setRequired(true).setAutocomplete(true)),

    async execute(client, interaction) {
        
        await interaction.deferReply({ephemeral: true})

        const song = interaction.options.getString("musique")
        if(!song) return interaction.followUp("Veuillez indiquez une musique a jouer")

        const voiceChannelOfUser = interaction.member.voice.channel
        const voiceChannelOfBot = (await interaction.guild.members.fetchMe()).voice.channel
        if(!voiceChannelOfUser) return await interaction.followUp(`Vous n'êtes pas dans un salon vocal`)
        if(voiceChannelOfBot && voiceChannelOfBot.id !== voiceChannelOfUser.id) return await interaction.followUp(`Vous n'êtes pas dans un salon vocal`)

        const queue = interaction.client.player.nodes.create(interaction.guild)

        await queue.addTrack(song)

        await queue.connect(voiceChannelOfUser)

        await queue.play()

        await interaction.followUp(`La musique \`${track.title}\` de ${track.author} va être jouée dans ${voiceChannelOfUser}`)
    }
}
