const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
.setName("previous")
.setDescription("Powrót do poprzedniego utworu.")
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
					.setDescription("Nie ma żadnych wcześniejszych utworów dla tej sesji."),
			],
			ephemeral: true,
		});
	}

	const previousSong = player.queue.previous;
	const currentSong = player.queue.current;
	const nextSong = player.queue[0]

	if (!previousSong
		|| previousSong === currentSong
		|| previousSong === nextSong) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription("W kolejce nie ma poprzedniego utworu."),
			],
		})}

	if (previousSong !== currentSong && previousSong !== nextSong) {
		player.queue.splice(0, 0, currentSong)
		player.play(previousSong);
	}
	interaction.reply({
		embeds: [
			new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(
					`⏮ | Poprzednia piosenka: **${ previousSong.title }**`,
				),
		],
	});
});

module.exports = command;
