const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js')
    
module.exports = {
        data: new SlashCommandBuilder()
            .setName("adminticket")
            .setDescription("Gérer le module des tickets")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .setDMPermission(false),
            
    async execute(client, message, args) {

        
        let embed = new Discord.EmbedBuilder()
        .setColor('#ffffff')
        .setTitle("Création d'un ticket")
        .setDescription("Pour créer un ticket, cliquez sur le bouton ci-dessous !")
        .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
        .setTimestamp()
    
        let btn = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`ticket`)
            .setEmoji('🎫')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(false)
        )
    
        message.reply({content: "Embed ticket déployé", ephemeral: true});
        message.channel.send({ embeds: [embed], components: [btn]});
    }
}
