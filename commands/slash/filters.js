const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
	.setName("filters")
	.setDescription("Dodaj lub usuń filtry")
	.addStringOption((option) =>
		option
			.setName("preset")
			.setDescription("preset do dodania")
			.setRequired(true)
			.addChoices(
				{ name: "Nightcore", value: "nightcore" },
				{ name: "BassBoost", value: "bassboost" },
				{ name: "Vaporwave", value: "vaporwave" },
				{ name: "Pop", value: "pop" },
				{ name: "Soft", value: "soft" },
				{ name: "Treblebass", value: "treblebass" },
				{ name: "Eight Dimension", value: "eightD" },
				{ name: "Karaoke", value: "karaoke" },
				{ name: "Vibrato", value: "vibrato" },
				{ name: "Tremolo", value: "tremolo" },
				{ name: "Reset", value: "off" },
			),
	)
	
	.setRun(async (client, interaction, options) => {
		const args = interaction.options.getString("preset");
		
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
						.setDescription("Nie gra żadna muzyka."),
				],
				ephemeral: true,
			});
		}
		
		// create a new embed
		let filtersEmbed = new MessageEmbed().setColor(client.config.embedColor);
		
		if (args == "nightcore") {
			filtersEmbed.setDescription("✅ | Filtr Nightcore jest teraz aktywny!");
			player.nightcore = true;
		} else if (args == "bassboost") {
			filtersEmbed.setDescription("✅ | Filtr BassBoost jest teraz włączony!");
			player.bassboost = true;
		} else if (args == "vaporwave") {
			filtersEmbed.setDescription("✅ | Filtr Vaporwave jest teraz włączony!");
			player.vaporwave = true;
		} else if (args == "pop") {
			filtersEmbed.setDescription("✅ | Filtr pop jest teraz włączony!");
			player.pop = true;
		} else if (args == "soft") {
			filtersEmbed.setDescription("✅ | Miękki filtr jest teraz włączony!");
			player.soft = true;
		} else if (args == "treblebass") {
			filtersEmbed.setDescription("✅ | Filtr tonów wysokich jest teraz włączony!");
			player.treblebass = true;
		} else if (args == "eightD") {
			filtersEmbed.setDescription("✅ | Filtr Eight Dimension jest teraz włączony!");
			player.eightD = true;
		} else if (args == "karaoke") {
			filtersEmbed.setDescription("✅ | Filtr karaoke jest teraz włączony!");
			player.karaoke = true;
		} else if (args == "vibrato") {
			filtersEmbed.setDescription("✅ | Filtr Vibrato jest teraz włączony!");
			player.vibrato = true;
		} else if (args == "tremolo") {
			filtersEmbed.setDescription("✅ | Filtr tremolo jest teraz włączony!");
			player.tremolo = true;
		} else if (args == "off") {
			filtersEmbed.setDescription("✅ | EQ zostało usunięte!");
			player.reset();
		} else {
			filtersEmbed.setDescription("❌ | Niepoprawny filtr!");
		}
		
		return interaction.reply({ embeds: [filtersEmbed] });
	});

module.exports = command;
