const {SlashCommandBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('I ping you pong.. no wait I said the reverse'),
	category: "misc",
	async execute(interaction){
		await interaction.reply(`Pong! @${interaction.client.ws.ping}ms`)
	},
}