const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.js');

module.exports = async client => {
    
    const commands = [];

    const foldersPath = path.join(__dirname, 'Commandes');
    const commandFolders = fs.readdirSync(foldersPath);
    
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[AVERTISSEMENT] La commande à ${filePath} manque une propriété requise "data" ou "execute".`);
            }
        }
    }

    try {

        const rest = new REST({version: "10"}).setToken(token);
        const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log(`[INITIALISATION] ${data.length} commandes (/) d'application rechargées avec succès.`);
    } catch (error) {
        
        console.error(error);
    }
};