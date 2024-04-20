const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("Gérer le module des tickets")
        .setDMPermission(false)
        
        .addSubcommand(subcommand =>
        subcommand
        .setName('invite')
        .setDescription('Permet d\'ajouter un membre de vote ticket')
        .addUserOption(option => option.setName('utilisateur').setDescription('Quel utilisateur ?').setRequired(true)))
        
        .addSubcommand(subcommand =>
        subcommand
        .setName('remove')
        .setDescription('Permet de retirer un membre de vote ticket')
        .addUserOption(option => option.setName('utilisateur').setDescription('Quel utilisateur ?').setRequired(true))),

        //faudras juste modifier ducoup dans le code args.getUser(utilisateur) et pas membre
        async execute(client, message, args) {
            
            const sub = args.getSubcommand();

            let user = args.getUser("utilisateur");
            if(!user) return message.reply({content: `Veuillez indiquer l'utilisateur  à ajouter/retirer dans votre ticket !`, ephemeral: true});
            let c = message.guild.channels.cache.get(message.channel.id)

            const topic = message.channel.topic; 
                
            const userIdRegex = /ID de l'utilisateur: (\d+)/;
            const match = topic.match(userIdRegex);

            const userId = match[1];

            const resp_ticket = ['1228094234603819058', '1228094234603819058']

            //l'utilisateur sera choisi dans la commande donc pas besoin de le redéclarer, j'ai donc mit la ligne au dessus
            // ainsi que le salon
            switch (sub) {
            
                //switch sub
                case 'remove':
                    

                    if(message.channel.parentId != "1176973501618471014") return message.reply({content: `Le salon est invalide`, ephemeral: true});

                    if(userId == user.id) return message.reply({content: `Vous ne pouvez pas retirer le créateur du ticket !`, ephemeral: true});

                    if(user == message.user) return message.reply({content: 'Vous ne pouvez pas vous retirer vous même du ticket !', ephemeral: true})

                    const member = message.guild.members.cache.get(user.id);

                    //                                        Resp. Tickets                                  Modérateur
                    if (member && (member.roles.cache.has('1228094234603819058') || member.roles.cache.has('1228094234603819058'))) return message.reply({content: `${user} ne peux pas être retiré du ticket, car il est membre du Staff / des Responsables Tickets`, ephemeral: true});

                    c.permissionOverwrites.delete(user.id)

                    await message.reply({ content: `L'utilisateur ${user} a été retiré de votre ticket !`, ephemeral: true})
                    await c.send(`L'utilisateur ${user} a été retiré du ticket par ${message.user}`)
                
                break;
                
                //switch sub
                case 'invite':

                    if(message.channel.parentId != "1176973501618471014") return message.reply({content: `Le salon est invalide`, ephemeral: true})

                    c.permissionOverwrites.create((user.id), {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true,
                    })

                    message.reply({ content: `L'utilisateur ${user} a été ajouté dans votre ticket !`, ephemeral: true})
                    c.send(`L'utilisateur ${user} a été ajouté dans le ticket par ${message.user}`)

                break;
            }
    },
};