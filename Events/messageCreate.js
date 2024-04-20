const { Events, PermissionFlagsBits, ChannelType } = require('discord.js');
const Discord = require('discord.js')
      
module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
     let db = client.db;
    if(message.author.client || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req) => {

    if(req.length < 1) {

    db.query(`INSERT INTO server (guild, captcha) VALUES (${message.guild.id}, 'false')`)
        }
   })

    //if(message.content === "Salut", "slt", "wsh", "wesh"){
        //message.react('👋')
    //}
}
}