const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("8d")
		.setDescription("Permet de jouer une musique")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option.setName('filtre').setDescription('Ajoute un filtre à la musique').setRequired(true).addChoices(...Object.keys(require("discord-player").AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25))),

    async execute(client, interaction) {
        
        const queue = interaction.client.player.nodes.create(interaction.guild);
        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `No music currently playing ${interaction.member}... try again ? ❌`, ephemeral: true });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];

        const infilter = interaction.options.getString("filtre");


        const filters = [];

        queue.filters.ffmpeg.getFiltersEnabled().map(x => filters.push(x));
        queue.filters.ffmpeg.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === infilter.toLowerCase().toString());

        if (!filter) return await interaction.reply({ content: `This filter doesn't exist ${interaction.member}... try again ? ❌\n${actualFilter ? `Filter currently active ${actualFilter}.\n` : ''}List of available filters ${filters.map(x => `${x}`).join(', ')}.`, ephemeral: true });

        await queue.filters.ffmpeg.toggle(filter)

        const FilterEmbed = new EmbedBuilder()
        .setAuthor({name: `The filter ${filter} is now ${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'} ✅\n*Reminder the longer the music is, the longer this will take.*`})
        .setColor('#2f3136')

       return await interaction.reply({ embeds: [FilterEmbed] });
    }
}
