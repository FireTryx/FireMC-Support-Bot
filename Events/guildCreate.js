const { Events, Collection } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    let db = client.db;

    // db.query(`SELECT * FROM server WHERE guild = ${guild.id}`, async (err, req) => {
    //     if (req.length < 1) {
    //       db.query(`INSERT INTO server (guild, captcha) VALUES (${guild.id}, "false")`);
    //     }
    // });
  },
};

// 
//vire toutes les commandes inutiles aux tickets stp, oui, dcp tu essaie pas l'autocomplete ? 
// ahh mais il y a la commande /help