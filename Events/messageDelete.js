const { Events, Collection, EmbedBuilder, ChannelType } = require('discord.js');
const Discord = require('discord.js')

module.exports = {
	name: Events.MessageDelete,
	async execute(message, client) {
    
        if(message.channel.type === ChannelType.DM || message.author.client) return;

            if (client.snipes.get(message.channel.id)) {
                const messages = client.snipes.get(message.channel.id)
                if (messages.length >= 10) {
                    messages.shift()
                }
                messages.push(message)
                await client.snipes.set(message.channel.id, messages)
            } else {
                await client.snipes.set(message.channel.id, [message])
        }
    }
}