const {SlashCommandBuilder, EmbedBuilder ,PermissionFlagsBits} = require('discord.js');

function isDST(d) {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();    
}

module.exports = {
	data: new SlashCommandBuilder().setName('make-embed').setDescription('I make embed for Nanashi in int 1 only... for now').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	category: "admin",
	async execute(interaction){
		const now = new Date();
		const channel = interaction.client.channels.cache.get('1103519881309200456');

		const winterEmbed = new EmbedBuilder()
			.setColor(0xA020F0)
			.setTitle('Class Time')
			.setDescription('\nSaturdays <t:1677337200:t>\n\nTaught by <@299039673865601024>\n\n*The times are in your time zone. You don\'t have to convert.*')

		const summerEmbed = new EmbedBuilder()
			.setColor(0xA020F0)
			.setTitle('Class Time')
			.setDescription('\nSaturdays <t:1683990000:t>\n\nTaught by <@299039673865601024>\n\n*The times are in your time zone. You don\'t have to convert.*')
		
		// interaction.reply({content: isDST(now).toString(), ephemeral: true});
		
		if(!isDST(now)) {
			channel.messages.fetch().then((messages) => {
				const pmsgs = messages.filter(message => message.pinned);
				const ids = pmsgs.map(message => message.id);
				channel.messages.fetch(ids[ids.length-1]).then(message => message.unpin("New Embed")).then(() => channel.send("Unpinned")).catch(console.error);
			})
			console.log("Sending Embed");
			channel.send({ embeds: [winterEmbed] }).then(message => message.pin()).catch(console.error);
			interaction.reply({content: "Sent!", ephemeral: true})
		} else {
			channel.messages.fetch().then((messages) => {
				const pmsgs = messages.filter(message => message.pinned);
				const ids = pmsgs.map(message => message.id);
				channel.messages.fetch(ids[ids.length-1]).then(message => message.unpin("New Embed")).then(() => channel.send("Unpinned")).catch(console.error);
			})
			console.log("Sending Embed");
			channel.send({ embeds: [summerEmbed] }).then(message => message.pin()).catch(console.error);
			interaction.reply({content: "Sent!", ephemeral: true})
		}
	},
}