const fs = require('fs');
const path = require('path');
const { Client, Collection, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');
const token = process.env.token;


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (folder of commandFolders) {
	const commandsPath = path.join(folderPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filepath = path.join(commandsPath, file);
		const command = require(filepath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command)
		} else {
			console.log(`Warning! Command at ${filepath} lacks data or execute.`)
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (file of eventFiles) {
	const filepath = path.join(eventsPath, file);
	const event = require(filepath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

client.on(Events.ClientReady, () => {
	const channel = client.channels.cache.get('1103519881309200456');

	const startDate = new Date();

	const winterEmbed = new EmbedBuilder()
		.setColor(0xA020F0)
		.setTitle('Class Time')
		.setDescription('\nSaturdays <t:1677337200:t>\n\nTaught by <@299039673865601024>\n\n*The times are in your time zone. You don\'t have to convert.*')

	const summerEmbed = new EmbedBuilder()
		.setColor(0xA020F0)
		.setTitle('Class Time')
		.setDescription('\nSaturdays <t:1683990000:t>\n\nTaught by <@299039673865601024>\n\n*The times are in your time zone. You don\'t have to convert.*')
	
	const interval = 86400000;

	setInterval(() => {
		const now = new Date();

		if(now.getUTCMonth() === 2 && now.getUTCDate()>7 && now.getUTCDate()<15 && now.getUTCDay()===0) {
			channel.messages.fetch().then((messages) => {
				const pmsgs = messages.filter(message => message.pinned);
				const ids = pmsgs.map(message => message.id);
				channel.messages.fetch(ids[ids.length-1]).then(message => message.unpin("New Embed")).then(() => channel.send("Unpinned")).catch(console.log("Error unpinning or fetching messages"));
			})
			console.log("Sending Embed");
			channel.send({ embeds: [winterEmbed] }).then(message => message.pin()).catch(console.log("Error pinning or sending embed"));
		} else if (now.getUTCMonth() === 10 && now.getUTCDate()>0 && now.getUTCDate()<8 && now.getUTCDay()===0){
			channel.messages.fetch().then((messages) => {
				const pmsgs = messages.filter(message => message.pinned);
				const ids = pmsgs.map(message => message.id);
				channel.messages.fetch(ids[ids.length-1]).then(message => message.unpin("New Embed")).then(() => channel.send("Unpinned")).catch(console.log("Error unpinning or fetching messages"));
			})
			console.log("Sending Embed");
			channel.send({ embeds: [summerEmbed] }).then(message => message.pin()).catch(console.log("Error pinning or sending embed"));
		}
	}, interval);
})

client.login(token);