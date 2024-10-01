const SlashCommand = require("../../lib/SlashCommand");
const prettyMilliseconds = require("pretty-ms");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

const command = new SlashCommand()
  .setName("search")
  .setDescription("Wyszukaj piosenkę")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Utwór do wyszukania")
      .setRequired(true)
  )
  .setRun(async (client, interaction, options) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) {
      return;
    }

    let player;
    if (client.manager) {
      player = client.createPlayer(interaction.channel, channel);
    } else {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Węzeł Lavalink nie jest podłączony"),
        ],
      });
    }
    await interaction.deferReply().catch((_) => {});

    if (player.state !== "CONNECTED") {
      player.connect();
    }

    const search = interaction.options.getString("query");
    let res;

    try {
      res = await player.search(search, interaction.user);
      if (res.loadType === "LOAD_FAILED") {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setDescription("Wystąpił błąd podczas wyszukiwania utworu")
              .setColor("RED"),
          ],
          ephemeral: true,
        });
      }
    } catch (err) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: "Wystąpił błąd podczas wyszukiwania utworu",
            })
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    }

    if (res.loadType == "NO_MATCHES") {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setDescription(`Nie znaleziono żadnych wyników dla \`${search}\``)
            .setColor("RED"),
        ],
        ephemeral: true,
      });
    } else {
      let max = 10;
      if (res.tracks.length < max) {
        max = res.tracks.length;
      }

      let resultFromSearch = [];

      res.tracks.slice(0, max).map((track) => {
        resultFromSearch.push({
          label: `${track.title}`,
          value: `${track.uri}`,
          description: track.isStream
            ? `LIVE`
            : `${prettyMilliseconds(track.duration, {
                secondsDecimalDigits: 0,
              })} - ${track.author}`,
        });
      });

      const menus = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select")
          .setPlaceholder("Wybierz utwór")
          .addOptions(resultFromSearch)
      );

      let choosenTracks = await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(
              `Oto niektóre z wyników znalezionych dla \`${search}\`. Wybierz utwór w ciągu \`30 sekund\``
            ),
        ],
        components: [menus],
      });
      const filter = (button) => button.user.id === interaction.user.id;

      const tracksCollector = choosenTracks.createMessageComponentCollector({
        filter,
        time: 30000,
      });
      tracksCollector.on("collect", async (i) => {
        if (i.isSelectMenu()) {
          await i.deferUpdate();
          let uriFromCollector = i.values[0];
          let trackForPlay;

          trackForPlay = await player?.search(
            uriFromCollector,
            interaction.user
          );
          player?.queue?.add(trackForPlay.tracks[0]);
          if (!player?.playing && !player?.paused && !player?.queue?.size) {
            player?.play();
          }
          i.editReply({
            content: null,
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: "Dodano do kolejki",
                  iconURL: client.config.iconURL,
                })
                .setURL(res.tracks[0].uri)
                .setThumbnail(res.tracks[0].displayThumbnail("maxresdefault"))
                .setDescription(
                  `[${trackForPlay?.tracks[0]?.title}](${trackForPlay?.tracks[0].uri})` ||
                    "Brak tytułu"
                )
                .addFields(
                  {
                    name: "Dodane przez",
                    value: `<@${interaction.user.id}>`,
                    inline: true,
                  },
                  {
                    name: "Długość",
                    value: res.tracks[0].isStream
                      ? `\`LIVE :red_circle:\``
                      : `\`${client.ms(res.tracks[0].duration, {
                          colonNotation: true,
                        })}\``,
                    inline: true,
                  }
                )
                .setColor(client.config.embedColor),
            ],
            components: [],
          });
        }
      });
      tracksCollector.on("end", async (i) => {
        if (i.size == 0) {
          choosenTracks.edit({
            content: null,
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `Nie wybrano utworu. Wybór utworu trwał zbyt długo.`
                )
                .setColor(client.config.embedColor),
            ],
            components: [],
          });
        }
      });
    }
  });

module.exports = command;
