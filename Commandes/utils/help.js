const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js")

module.exports = {

    data: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Permet d'avoir de l'aide sur les commandes")
            .setDMPermission(true)
            .addStringOption(option =>
                option.setName('commande').setDescription('Quelle commande').setRequired(false).setAutocomplete(true)),
    
    async execute(client, message, args) {

        let command;
        if(args.getString("commande")) {

            command = client.commands.get(args.getString("commande"));
            if(!command) return message.reply({content: `Cette commande n'existe pas !`, ephemeral: true});
        }

        if(command) {

            switch(command.data.name) {

                case 'ticket':

                    const ticketSubCommands = message.client.commands.get('ticket').data.toJSON().options;

                    let EmbedTicket = new EmbedBuilder()
                        .setTitle(`Commande ${command.data.name}`)
                        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`\`Nom\` : ${command.data.name}\n\`Description\` : ${command.data.description}\n\n\`Commandes associées\` :\n${ticketSubCommands.map(sub => `- ${sub.name} : ${sub.description}`).join('\n')}`)
                        .setTimestamp()
                        .setFooter({text: `Commande ${command.data.name}`})

                    await message.reply({embeds: [EmbedTicket]})
            
                break;

                default:

                    let EmbedCommand = new EmbedBuilder()
                    .setTitle(`Commande ${command.data.name}`)
                    .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`\`Nom\` : ${command.data.name}\n\`Description\` : ${command.data.description}\n\n\`Commandes associées\` : Aucune`)
                    .setTimestamp()
                    .setFooter({text: `Commande ${command.data.name}`})

                    await message.reply({embeds: [EmbedCommand]})

                break;
            }

        } else {

            let Embed = new EmbedBuilder()
                .setTitle("Commandes du client")
                .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Commandes : \`${client.commands.size}\``)
                .setTimestamp()
                .setFooter({text: "Commande /help"})

            let commands = client.commands
            Embed.addFields({name: `Voici la liste de toute les commandes disponibles`, value: `${commands.map(command =>`\`${command.data.name}\` : ${command.data.description}`).join("\n")}`})

            await message.reply({embeds: [Embed]})

        }
    }
}