const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("volume")
	.setDescription("Zmiana głośności bieżącego utworu.")
	.addNumberOption((option) =>
		option
			.setName("amount")
			.setDescription("Ilość głośności, którą chcesz zmienić. np: 10")
			.setRequired(false),
	)
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
						.setDescription("Nie jest odtwarzana muzyka."),
				],
				ephemeral: true,
			});
		}
		
		let vol = interaction.options.getNumber("amount");
		if (!vol || vol < 1 || vol > 125) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription(
							`:loud_sound: | Aktualna głośność **${ player.volume }**`,
						),
				],
			});
		}
		
		player.setVolume(vol);
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						`:loud_sound: | Pomyślnie ustawiono głośność na **${ player.volume }**`,
					),
			],
		});
	});

module.exports = command;
