const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autopause")
  .setDescription("Automatyczne wstrzymywanie, gdy wszyscy opuszczą kanał głosowy (przełącznik)")
  .setRun(async (client, interaction) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let player;
    if (client.manager)
      player = client.manager.players.get(interaction.guild.id);
    else
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Węzeł Lavalink nie jest podłączony"),
        ],
      });

    if (!player) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("W kolejce nic nie jest odtwarzane"),
        ],
        ephemeral: true,
      });
    }

    let autoPauseEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoPause = player.get("autoPause");
    player.set("requester", interaction.guild.members.me);

    if (!autoPause || autoPause === false) {
      player.set("autoPause", true);
    } else {
      player.set("autoPause", false);
    }
    autoPauseEmbed
			.setDescription(`**Automatyczna pauza jest** \`${!autoPause ? "WŁ" : "WYŁ"}\``)
			.setFooter({
			  text: `Muzyka będzie ${!autoPause ? "automatycznie" : "manualnie"} wstrzymywana, gdy wszyscy opuszczą kanał głosowy.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "AUTOPAUSE"
      )}] has been [${colors.blue(!autoPause ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return interaction.reply({ embeds: [autoPauseEmbed] });
  });

module.exports = command;
