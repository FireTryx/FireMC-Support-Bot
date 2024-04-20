const Discord = require("discord.js")
const loadDatabase = require("../loadDatabase")
const { ActivityType, Events } = require("discord.js")
const config = require("../config")

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

    // client.db = await loadDatabase()
    // client.db.connect(function (err) {
    //     if(err){
    //         console.log("Une erreur s'est produite lors du chargement de la BDD (Base de données) !")
    //         return process.exit();
    //     } 
    //     else{
    //         return console.log("La base de données est bien connectée !")
    //     }
    // })
    
   
    console.log(`${client.user.username} est bien en ligne !`)
    try{client.user.setPresence({
        status: 'DND',
        activities: [{
            name: '/help | Version 0.50.1 Bêta',
            type: ActivityType.Watching
        }]
    })

    console.log(`Le status à été réglé sur "Regarde /help | Version 0.50.1 Bêta !"`)
    } catch {
        console.log(`Une erreur s'est produite lors du démarrage du service d'activité`)
    }
}
}