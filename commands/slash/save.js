const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

const command = new SlashCommand()
	.setName("save")
	.setDescription("Zapisuje bieżący utwór w DM")
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
						.setDescription("W tej chwili nie jest odtwarzana żadna piosenka."),
				],
				ephemeral: true,
			});
		}
		
		const sendtoDmEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setAuthor({
				name: "Zapisany utwór",
				iconURL: `${ interaction.user.displayAvatarURL({ dynamic: true }) }`,
			})
			.setDescription(
				`**Zapisany [${ player.queue.current.title }](${ player.queue.current.uri }) do twoich wiadomości prywatnych**`,
			)
			.addFields(
				{
					name: "Czas trwania utworu",
					value: `\`${ prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true,
					}) }\``,
					inline: true,
				},
				{
					name: "Autor utworu",
					value: `\`${ player.queue.current.author }\``,
					inline: true,
				},
				{
					name: "Żądana gildia",
					value: `\`${ interaction.guild }\``,
					inline: true,
				},
			);
		
		interaction.user.send({ embeds: [sendtoDmEmbed] });
		
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(
						"Sprawdź swoje **DM**. Jeśli nie otrzymałeś ode mnie żadnej wiadomości, upewnij się, że Twoje **DM** są otwarte.",
					),
			],
			ephemeral: true,
		});
	});

module.exports = command;
