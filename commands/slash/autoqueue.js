const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
	.setName("autoqueue")
	.setDescription("Automatyczne dodawanie utworów do kolejki (przełączanie)")
	.setRun(async (client, interaction) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Węzeł Lavalink nie jest podłączony"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("W kolejce nic nie jest odtwarzane"),
				],
				ephemeral: true,
			});
		}
		
		let autoQueueEmbed = new MessageEmbed().setColor(client.config.embedColor);
		const autoQueue = player.get("autoQueue");
		player.set("requester", interaction.guild.members.me);
		
		if (!autoQueue || autoQueue === false) {
			player.set("autoQueue", true);
		} else {
			player.set("autoQueue", false);
		}
		autoQueueEmbed
		  .setDescription(`**Kolejka automatyczna jest** \`${!autoQueue ? "WŁ" : "WYŁ"}\``)
		  .setFooter({
		    text: `Powiązana muzyka ${!autoQueue ? "będzie teraz automatycznie" : "już nie będzie"} dodawana do kolejki.`
      });
		client.warn(
			`Player: ${ player.options.guild } | [${ colors.blue(
				"AUTOQUEUE",
			) }] has been [${ colors.blue(!autoQueue? "ENABLED" : "DISABLED") }] in ${
				client.guilds.cache.get(player.options.guild)
					? client.guilds.cache.get(player.options.guild).name
					: "a guild"
			}`,
		);
		
		return interaction.reply({ embeds: [autoQueueEmbed] });
	});

module.exports = command;
