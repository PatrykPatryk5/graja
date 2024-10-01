/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").GuildCommandInteraction} interaction
 * @returns
 */
module.exports = async (client, interaction) => {
	return new Promise(async (resolve) => {
		if (!interaction.member.voice.channel) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Aby użyć tego polecenia, musisz znajdować się na kanale głosowym!",
					),
				],
			});
			return resolve(false);
		}
		if (
			interaction.guild.members.me.voice.channel &&
			interaction.member.voice.channel.id !==
			interaction.guild.members.me.voice.channel.id
		) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Aby użyć tego polecenia, musisz być na tym samym kanale głosowym co ja!",
					),
				],
			});
			return resolve(false);
		}
		if (!interaction.member.voice.channel.joinable) {
			await interaction.reply({
				embeds: [
					client.ErrorEmbed(
						"Nie mam wystarczających uprawnień, aby dołączyć do twojego kanału głosowego!",
					),
				],
			});
			return resolve(false);
		}
		
		resolve(interaction.member.voice.channel);
	});
};
