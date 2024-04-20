const fs = require('fs');
const path = require('path');

module.exports = async client => {

	const eventsPath = path.join(__dirname, 'Events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {

		const filePath = path.join(eventsPath, file);
		const event = require(filePath);

		if (event.once) {

			client.once(event.name, (...args) => event.execute(...args, client));
			console.log(`[LOADER] Event ${event.name} loaded successfully`)
		} else {
			
			client.on(event.name, (...args) => event.execute(...args, client));
			console.log(`[LOADER] Event ${event.name} loaded successfully`)
		}

	}
}