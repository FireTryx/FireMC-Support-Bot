const Discord = require("discord.js")
const { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")
const transcript = require("discord-html-transcripts");
const { Events } = require('discord.js')
const { QueryType } = require("discord-player")

module.exports = {

	name: Events.InteractionCreate,
	async execute(interaction, client) {
    
    const db = client.db

    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
       
        let entry = interaction.options.getFocused()

        if (interaction.commandName === "play") {
        
          const resultsSpotify = await client.player.search(interaction.options.getFocused(), { searchEngine: QueryType.SPOTIFY_SEARCH });
          const resultsYouTube = await client.player.search(interaction.options.getFocused(), { searchEngine: QueryType.YOUTUBE });
  
          // const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((track) => ({ name: `Spotify : ${`${track.title} - ${track.author}`.length > 75 ? `${`${track.title} - ${track.author}`.substring(0, 75)}...` : `${track.title} - ${track.author}`}`, value: track.url }));
          const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((track) => ({ name: `YouTube : ${`${track.title} - ${track.author}`.length > 75 ? `${`${track.title} - ${track.author}`.substring(0, 75)}...` : `${track.title} - ${track.author}`}`, value: track.url }));
          
          const tracks = [];
          //tracksSpotify.forEach((t) => tracks.push({ name: t.name, value: t.value }));
          await tracksYouTube.forEach((t) => tracks.push({ name: t.name, value: t.value }));
                      
          try {
              return await interaction.respond(tracks);   
          } catch (err) {
              return console.log(`[Autocomplete ERROR] - ${interaction.commandName}`, err);
          }
      }

        if(interaction.commandName === "help") {
           
          const cmds = client.commands.filter(cmd => cmd.data.name.startsWith(entry));
          await interaction.respond(cmds.map(cmd => ({name: cmd.data.name, value: cmd.data.name})).slice(0, 25));
        }
    }

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
    
      // client.db.query(`SELECT * FROM blacklisted_users WHERE user_id = ${interaction.user.id}`, async (err, req) => {
      //   if(req.length >= 1) {

      //     const reason = req[0].reason
      //     return await interaction.reply({content: `Vous êtes blacklisté du client pour la raison : \`${reason}\`\n Si vous pensez que c'est une erreur, veuillez créer un ticket !`, ephemeral: true})
      //   } else {

      //     const command = interaction.client.commands.get(interaction.commandName);
      //     if (command.ownerOnly && !ownerId.includes(interaction.user.id)) return await interaction.reply({content: 'Seul les gens faisant parti de la liste peuvent exécuter cette commande!', ephemeral: true});
      //     await command.execute(client, interaction, interaction.options, client.db)
      //   }
      // })

      const command = interaction.client.commands.get(interaction.commandName);
      await command.execute(client, interaction, interaction.options, client.db)

    }

    if(interaction.isButton()) {

      // TICKETS

      if(interaction.customId === "ticket") {
   
        const ticket = new Discord.ModalBuilder()
        .setCustomId('ticket')
        .setTitle("Création d'un ticket")
   
        const Sujet = new Discord.TextInputBuilder()
        .setCustomId('sujet')
        .setLabel("Quel est le sujet de votre ticket ?")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short)
   
        const Probleme = new Discord.TextInputBuilder()
        .setCustomId('probleme')
        .setLabel("Quel est le problème ?")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Paragraph)
   
        const Sujet01 = new Discord.ActionRowBuilder().addComponents(Sujet);
        const Probleme01 = new Discord.ActionRowBuilder().addComponents(Probleme);
   
        ticket.addComponents(Sujet01, Probleme01);
        await interaction.showModal(ticket)
   
        const reponse = await interaction.awaitModalSubmit({time: 300000})
   
        const Sujet02 = reponse.fields.getTextInputValue('sujet')
        const Probleme02 = reponse.fields.getTextInputValue('probleme')
   
        const Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle("Ticket")
        .setDescription(`**Sujet :** ${Sujet02}\n**Problème** :${Probleme02}`)
        .setFooter({ text: `Ticket de ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
   
        const Button = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
        .setCustomId(`closeticket`)
        .setLabel(`Fermer`)
        .setStyle(Discord.ButtonStyle.Danger),
        new Discord.ButtonBuilder()
        .setCustomId(`claim`)
        .setLabel(`Claim le ticket`)
        .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
        .setCustomId(`transcripts`)
        .setLabel(`Sauvegarder`)
        .setStyle(Discord.ButtonStyle.Primary));

        interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: Discord.ChannelType.GuildText,
          topic: `Ticket de ${interaction.user.username} / ID de l'utilisateur: ${interaction.user.id}`,
          parent: "1176973501618471014",
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [Discord.PermissionFlagsBits.ViewChannel],
            },  
            {
              id: interaction.user.id,
              allow: [Discord.PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.guild.roles.cache.get("1174780405006737469"),
              allow: [Discord.PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.guild.roles.cache.get("1174780240904585216"),
              allow: [Discord.PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.guild.roles.cache.get("1174777988584308757"),
              allow: [Discord.PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.guild.roles.cache.get("1174778611031625860"),
              allow: [Discord.PermissionFlagsBits.ViewChannel]
            },
          ],
        }).then((c) => { 
          
          c.send({content: `<@&1228094234603819058>\n\nBonjour ${interaction.user}, le staff va vous répondre dans les plus brefs délais !`, embeds: [Embed], components: [Button]})
          reponse.reply({content: `Votre ticket a été créé avec succès. ${c}`, ephemeral: true})

        })  
      }


      else if(interaction.customId === "closeticket") {
   
        const ticketclose = new Discord.ModalBuilder()
        .setCustomId('ticketclose')
        .setTitle("Cloture d'un Ticket")
    
        const reason01 = new Discord.TextInputBuilder()
        .setCustomId('raison')
        .setLabel("Pourquoi voulez-vous fermer le ticket ?")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short)
    
        const reason02 = new Discord.ActionRowBuilder().addComponents(reason01);

        const topic = interaction.channel.topic; // Récupère l'ID de l'utilisateur-créateur du ticket
        
        const userIdRegex = /ID de l'utilisateur: (\d+)/;
        const match = topic.match(userIdRegex);

        const userId = match[1];

        const user = client.users.cache.get(userId);
    
        if(user !== interaction.user && !(interaction.member.roles.cache.has('1228094234603819058') || interaction.member.roles.cache.has('1174777988584308757') || interaction.member.roles.cache.has('1174777685008986282'))) {
          
          await interaction.reply({ content: `Vous n'avez pas la permission requise pour fermer le ticket`, ephemeral: true });
          return;
      }

        ticketclose.addComponents(reason02);
        await interaction.showModal(ticketclose)

        const reponse = await interaction.awaitModalSubmit({time: 300000})
        const reason03 = reponse.fields.getTextInputValue('raison');
        await reponse.reply({content: `Votre ticket a été fermé avec succès.`, ephemeral: true})
        await interaction.channel.send(`Le ticket de ${user} a été fermé par ${interaction.user}\n\nRaison: ${reason03}`)

        const EmbedTranscript = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Transcript : **${interaction.channel.name}**`)

        try { await client.users.cache.get(userId).send({embeds: [EmbedTranscript], files: [await transcript.createTranscript(interaction.channel)], content: `**Votre ticket à été fermé par **${interaction.user}**.**\n**Raison: **${reason03}`}) } catch {}

        const transcripts_channel = client.channels.cache.get("1226642113949597738");

        await transcripts_channel.send( {embeds: [EmbedTranscript], files: [await transcript.createTranscript(interaction.channel)]})
        await interaction.channel.delete();

      } 

      else if(interaction.customId === "claim") {
   
        const claim_channel = interaction.channel;

        //##############################################//
        //                     TODO                     //
        //##############################################//
        //                                              //
        //    Role verification to claim the ticket     //
        //                                              //
        //##############################################//
        //                                              //
        //##############################################//


        const topic = interaction.channel.topic; // Récupère l'ID de l'utilisateur-créateur du ticket
      
        const userIdRegex = /ID de l'utilisateur: (\d+)/;
        const match = topic.match(userIdRegex);

        const userId = match[1];

        const user = client.users.cache.get(userId);

        if(!(interaction.member.roles.cache.has('1228094234603819058') || interaction.member.roles.cache.has('1174777988584308757') || interaction.member.roles.cache.has('1174777685008986282'))) return interaction.reply({content: `Vous n'avez pas la permission requise pour claim le ticket`, ephemeral: true});

        await interaction.reply({content: `Vous avez claim le ticket.`, ephemeral: true})
        claim_channel.send(`${interaction.user} a claim le ticket de ${user}, il va donc vous prendre en charge`)

      }

      else if(interaction.customId === "transcripts") {
   
        const EmbedTranscript = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setDescription(`Transcript : **${interaction.channel.name}**`)
   
        const EmbedPermissionTranscript = new EmbedBuilder()
        .setColor(client.color)
        .setDescription("Vous n'avez pas la permission requise !")
   
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) return interaction.reply({embeds: [EmbedPermissionTranscript], ephemeral: true})
   
        await interaction.deferReply({ ephemeral: true })
        await client.channels.cache.get("1226642113949597738").send( {embeds: [EmbedTranscript], files: [await transcript.createTranscript(interaction.channel)]})
        await interaction.editReply({content: `Ticket enregistré avec succès par ${interaction.user}.`, ephemeral: true})
      }
    }
  }
}
