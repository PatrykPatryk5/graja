const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("summon")
	.setDescription("Przywołuje bota do kanału.")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!interaction.member.voice.channel) {
			const joinEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(
					"❌ | **Aby użyć tego polecenia, należy znajdować się na kanale głosowym.**",
				);
			return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
		}
		
		let player = client.manager.players.get(interaction.guild.id);
		if (!player) {
			player = client.createPlayer(interaction.channel, channel);
			player.connect(true);
		}
		
		if (channel.id !== player.voiceChannel) {
			player.setVoiceChannel(channel.id);
			player.connect();
		}
		
		interaction.reply({
			embeds: [
				client.Embed(`:thumbsup: | **Udało się dołączyć do <#${ channel.id }>!**`),
			],
		});
	});

module.exports = command;
