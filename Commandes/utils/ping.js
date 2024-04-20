const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Affiche la latence du bot"),

    async execute(client, message) {
        
        await message.deferReply()
        
        setTimeout(async () => {
            await message.followUp(`📶Pong 🏓, La latence de l'API Discord est de ${Math.round(client.ws.ping)}ms 🛰️\n⏪📶Dernière latence enregistrée il y a ${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })} environ`);
        }, 2500); // Pause de 3 secondes (3000 millisecondes)
    }
}
