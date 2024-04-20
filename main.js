const { Collection, IntentsBitField, Client } = require("discord.js")
const intents = new IntentsBitField(3276799)
const client = new Client({intents})
const loadCommands = require('./deploy-commands.js')
const loadEvents = require("./loadEvents.js")
const { token, clientId, guildId} = require("./config.js")
const loadDatabase = require("./loadDatabase.js")
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const { Player } = require("discord-player")


loadCommands(client)
loadEvents(client)
loadDatabase(client)


client.color = "#A2D2FF";

client.commands = new Collection()


const foldersPath = path.join(__dirname, 'Commandes');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {

		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {

            client.commands.set(command.data.name, command);
			console.log(`[LOADER] ${command.data.name} is loaded !`)
		} else {

			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.player = new Player(client, {

	ytdlOptions: {
		filter: "audioonly",
		quality: "highestaudio",
		highWaterMark: 1 << 25,
	}
});

client.player.extractors.loadDefault((ext) => ext !== 'SpotifyExtractor');


client.login(token)