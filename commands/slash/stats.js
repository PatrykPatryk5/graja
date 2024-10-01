const SlashCommand = require("../../lib/SlashCommand");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const os = require("os");

const command = new SlashCommand()
	.setName("stats")
	.setDescription("Uzyskaj informacje o bocie")
	.setRun(async (client, interaction) => {
		// get OS info
		const osver = os.platform() + " " + os.release();
		
		// Get nodejs version
		const nodeVersion = process.version;
		
		// get the uptime in a human readable format
		const runtime = moment
			.duration(client.uptime)
			.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		// show lavalink uptime in a nice format
		const lavauptime = moment
			.duration(client.manager.nodes.values().next().value.stats.uptime)
			.format(" D[d], H[h], m[m]");
		// show lavalink memory usage in a nice format
		const lavaram = (
			client.manager.nodes.values().next().value.stats.memory.used /
			1024 /
			1024
		).toFixed(2);
		// sow lavalink memory alocated in a nice format
		const lavamemalocated = (
			client.manager.nodes.values().next().value.stats.memory.allocated /
			1024 /
			1024
		).toFixed(2);
		// show system uptime
		var sysuptime = moment
			.duration(os.uptime() * 1000)
			.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
		
		// get commit hash and date
		let gitHash = "unknown";
		try {
			gitHash = require("child_process")
				.execSync("git rev-parse HEAD")
				.toString()
				.trim();
		} catch (e) {
			// do nothing
			gitHash = "unknown";
		}
		
		const statsEmbed = new MessageEmbed()
			.setTitle(`${ client.user.username } Informacje`)
			.setColor(client.config.embedColor)
			.setDescription(
				`\`\`\`yml\nNazwa: ${ client.user.username }#${ client.user.discriminator } [${ client.user.id }]\nAPI: ${ client.ws.ping }ms\nCzas działania: ${ runtime }\`\`\``,
			)
			.setFields([
				{
					name: `Statystyki Lavalink`,
					value: `\`\`\`yml\nCzas działania: ${ lavauptime }\nRAM: ${ lavaram } MB\nGra: ${
						client.manager.nodes.values().next().value.stats.playingPlayers
					} z ${
						client.manager.nodes.values().next().value.stats.players
					}\`\`\``,
					inline: true,
				},
				{
					name: "Statystyki bota",
					value: `\`\`\`yml\nSerwery: ${
						client.guilds.cache.size
					} \nNodeJS: ${ nodeVersion }\nGrajek: v${
						require("../../package.json").version
					} \`\`\``,
					inline: true,
				},
				{
					name: "Statystyki systemu",
					value: `\`\`\`yml\nOS: ${ osver }\nCzas działania: ${ sysuptime }\n\`\`\``,
					inline: false,
				},
			])
			.setFooter({ text: `Build: ${ gitHash }` });
		return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
	});

module.exports = command;
