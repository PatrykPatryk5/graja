const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("shuffle")
	.setDescription("Losuje kolejkę")
	.setRun(async (client, interaction, options) => {
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
						.setDescription("Nie jest odtwarzana muzyka."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("W kolejce nie ma wystarczającej liczby utworów."),
				],
				ephemeral: true,
			});
		}
		
		//  if the queue is not empty, shuffle the entire queue
		player.queue.shuffle();
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("🔀 | **Pomyślnie przetasowano kolejkę.**"),
			],
		});
	});

module.exports = command;
