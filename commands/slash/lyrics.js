const SlashCommand = require("../../lib/SlashCommand");
const {
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
	MessageEmbed
} = require("discord.js");
const { Rlyrics } = require("rlyrics");
const lyricsApi = new Rlyrics();

const command = new SlashCommand()
	.setName("lyrics")
	.setDescription("Pobierz tekst piosenki")
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("Piosenka, do której należy pobrać tekst")
			.setRequired(false),
	)
	.setRun(async (client, interaction, options) => {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("🔎 | **Szukanie...**"),
			],
		});

		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Węzeł Lavalink nie jest podłączony"),
				],
			});
		}

		const args = interaction.options.getString("song");
		if (!args && !player) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Nic się nie dzieje"),
				],
			});
		}

		let currentTitle = ``;
		const phrasesToRemove = [
			"Full Video", "Full Audio", "Official Music Video", "Lyrics", "Lyrical Video",
			"Feat.", "Ft.", "Official", "Audio", "Video", "HD", "4K", "Remix", "Lyric Video", "Lyrics Video", "8K", 
			"High Quality", "Animation Video", "\\(Official Video\\. .*\\)", "\\(Music Video\\. .*\\)", "\\[NCS Release\\]",
			"Extended", "DJ Edit", "with Lyrics", "Lyrics", "Karaoke",
			"Instrumental", "Live", "Acoustic", "Cover", "\\(feat\\. .*\\)"
		];
		if (!args) {
			currentTitle = player.queue.current.title;
			currentTitle = currentTitle
				.replace(new RegExp(phrasesToRemove.join('|'), 'gi'), '')
				.replace(/\s*([\[\(].*?[\]\)])?\s*(\|.*)?\s*(\*.*)?$/, '');
		}
		let query = args ? args : currentTitle;
		let lyricsResults = [];

		lyricsApi.search(query).then(async (lyricsData) => {
			if (lyricsData.length !== 0) {
				for (let i = 0; i < client.config.lyricsMaxResults; i++) {
					if (lyricsData[i]) {
						lyricsResults.push({
							label: `${lyricsData[i].title}`,
							description: `${lyricsData[i].artist}`,
							value: i.toString()
						});
					} else { break }
				}

				const menu = new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("choose-lyrics")
						.setPlaceholder("Wybierz utwór")
						.addOptions(lyricsResults),
				);

				let selectedLyrics = await interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor(client.config.embedColor)
							.setDescription(
								`Oto niektóre wyniki znalezione dla \`${query}\`. Wybierz utwór, aby wyświetlić tekst w ciągu \`30 sekund\`.`
							),
					], components: [menu],
				});

				const filter = (button) => button.user.id === interaction.user.id;

				const collector = selectedLyrics.createMessageComponentCollector({
					filter,
					time: 30000,
				});

				collector.on("collect", async (interaction) => {
					if (interaction.isSelectMenu()) {
						await interaction.deferUpdate();
						const url = lyricsData[parseInt(interaction.values[0])].url;

						lyricsApi.find(url).then((lyrics) => {
							let lyricsText = lyrics.lyrics;

							const button = new MessageActionRow()
								.addComponents(
									new MessageButton()
										.setCustomId('tipsbutton')
										.setLabel('Wskazówki')
										.setEmoji(`📌`)
										.setStyle('SECONDARY'),
									new MessageButton()
										.setLabel('Źródło')
										.setURL(url)
										.setStyle('LINK'),
								);

							const musixmatch_icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Musixmatch_logo_icon_only.svg/480px-Musixmatch_logo_icon_only.svg.png';
							let lyricsEmbed = new MessageEmbed()
								.setColor(client.config.embedColor)
								.setTitle(`${lyrics.name}`)
								.setURL(url)
								.setThumbnail(lyrics.icon)
								.setFooter({
									text: 'Tekst piosenki dostarczony przez MusixMatch.',
									iconURL: musixmatch_icon
								})
								.setDescription(lyricsText);

							if (lyricsText.length === 0) {
								lyricsEmbed
									.setDescription(`**Niestety nie jesteśmy upoważnieni do pokazywania tych tekstów.**`)
									.setFooter({
										text: 'Teksty są ograniczone przez MusixMatch.',
										iconURL: musixmatch_icon
									})
							}

							if (lyricsText.length > 4096) {
								lyricsText = lyricsText.substring(0, 4050) + "\n\n[...]";
								lyricsEmbed
									.setDescription(lyricsText + `\nOkrojony, tekst był za długi.`)
							}

							return interaction.editReply({
								embeds: [lyricsEmbed],
								components: [button],
							});

						})
					}
				});

				collector.on("end", async (i) => {
					if (i.size == 0) {
						selectedLyrics.edit({
							content: null,
							embeds: [
								new MessageEmbed()
									.setDescription(
										`Nie wybrano żadnego utworu. Wybór utworu trwał zbyt długo.`
									)
									.setColor(client.config.embedColor),
							], components: [],
						});
					}
				});

			} else {
				const button = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setEmoji(`📌`)
							.setCustomId('tipsbutton')
							.setLabel('Wskazówki')
							.setStyle('SECONDARY'),
					);
				return interaction.editReply({
					embeds: [
						new MessageEmbed()
							.setColor("RED")
							.setDescription(
								`Nie znaleziono żadnych wyników dla \`${query}\`!\nUpewnij się, że poprawnie wpisałeś zapytanie.`,
							),
					], components: [button],
				});
			}
		}).catch((err) => {
			console.error(err);
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription(
							`Wystąpił nieznany błąd, sprawdź konsolę.`,
						),
				],
			});
		});

		const collector = interaction.channel.createMessageComponentCollector({
			time: 1000 * 3600
		});

		collector.on('collect', async interaction => {
			if (interaction.customId === 'tipsbutton') {
				await interaction.deferUpdate();
				await interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setTitle(`Wskazówki dotyczące tekstów`)
							.setColor(client.config.embedColor)
							.setDescription(
								`Oto kilka wskazówek, jak poprawnie napisać tekst piosenki.
                                1. Spróbuj dodać nazwę wykonawcy przed nazwą utworu.
                                2. Spróbuj wyszukać tekst ręcznie, podając zapytanie do utworu za pomocą klawiatury.
                                3. Unikaj wyszukiwania tekstów w językach innych niż angielski.`,
							),
					], ephemeral: true, components: []
				});
			};
		});
	});

module.exports = command;
