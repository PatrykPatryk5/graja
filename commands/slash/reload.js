const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");

const command = new SlashCommand()
	.setName("reload")
	.setDescription("Załaduj ponownie wszystkie polecenia")
	.setRun(async (client, interaction, options) => {
		if (interaction.user.id === client.config.adminId) {
			try {
				let ContextCommandsDirectory = path.join(__dirname, "..", "context");
				fs.readdir(ContextCommandsDirectory, (err, files) => {
					files.forEach((file) => {
						delete require.cache[
							require.resolve(ContextCommandsDirectory + "/" + file)
							];
						let cmd = require(ContextCommandsDirectory + "/" + file);
						if (!cmd.command || !cmd.run) {
							return this.warn(
								"❌ Nie można załadować komendy: " +
								file.split(".")[0] +
								", Plik nie zawiera polecenia/run",
							);
						}
						client.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
					});
				});
				
				let SlashCommandsDirectory = path.join(__dirname, "..", "slash");
				fs.readdir(SlashCommandsDirectory, (err, files) => {
					files.forEach((file) => {
						delete require.cache[
							require.resolve(SlashCommandsDirectory + "/" + file)
							];
						let cmd = require(SlashCommandsDirectory + "/" + file);
						
						if (!cmd || !cmd.run) {
							return client.warn(
								"❌ Nie można załadować komendy: " +
								file.split(".")[0] +
								", Plik nie zawiera prawidłowego polecenia z funkcją run",
							);
						}
						client.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
					});
				});
				
				const totalCmds =
					client.slashCommands.size + client.contextCommands.size;
				client.log(`Przeładowano ${ totalCmds } komend!`);
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(`Pomyślnie przeładowano \`${ totalCmds }\` Komend!`)
							.setFooter({
								text: `${ client.user.username } został przeładowany przez ${ interaction.user.username }`,
							})
							.setTimestamp(),
					],
					ephemeral: true,
				});
			} catch (err) {
				console.log(err);
				return interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(
								"Wystąpił błąd. Aby uzyskać więcej informacji, sprawdź konsolę.",
							),
					],
					ephemeral: true,
				});
			}
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(client.config.embedColor)
						.setDescription("Nie jesteś upoważniony do używania tego polecenia!"),
				],
				ephemeral: true,
			});
		}
	});

module.exports = command;
