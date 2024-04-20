const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("filtres")
		.setDescription("Permet de jouer une musique")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option.setName('filtre').setDescription('Ajoute un filtre à la musique').setRequired(true).addChoices(...Object.keys(require("discord-player").AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25))),

    async execute(client, interaction) {
        
        const queue = interaction.client.player.nodes.create(interaction.guild);
        if (!queue || !queue.isPlaying()) return await interaction.reply({ content: `Aucune musique est lancée ${interaction.member}... veuillez réessayez ? ❌`, ephemeral: true });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];

        const infilter = interaction.options.getString("filtre");


        const filters = [];

        queue.filters.ffmpeg.getFiltersEnabled().map(x => filters.push(x));
        queue.filters.ffmpeg.getFiltersDisabled().map(x => filters.push(x));

        const filter = filters.find((x) => x.toLowerCase() === infilter.toLowerCase().toString());

        if (!filter) return await interaction.reply({ content: `Ce filtre n'existe pas ${interaction.member}... try again ? ❌\n${actualFilter ? `Filter currently active ${actualFilter}.\n` : ''}List of available filters ${filters.map(x => `${x}`).join(', ')}.`, ephemeral: true });

        await queue.filters.ffmpeg.toggle(filter)

        const FilterEmbed = new EmbedBuilder()
        .setAuthor({name: `Le filtre ${filter} est maintenant ${queue.filters.ffmpeg.isEnabled(filter) ? 'activé' : 'désactivé'} ✅\n*Reminder the longer the music is, the longer this will take.*`})
        .setColor('#2f3136')

       await interaction.reply({ embeds: [FilterEmbed] });
    }
}
