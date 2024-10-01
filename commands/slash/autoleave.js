const colors = require("colors");
const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autoleave")
  .setDescription("Automatycznie wychodzi, gdy wszyscy opuszczą kanał głosowy (przełącznik)")
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
            .setDescription("W kolejce nic się nie dzieje"),
        ],
        ephemeral: true,
      });
    }

    let autoLeaveEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoLeave = player.get("autoLeave");
    player.set("requester", interaction.guild.me);

    if (!autoLeave || autoLeave === false) {
      player.set("autoLeave", true);
    } else {
      player.set("autoLeave", false);
    }
    autoLeaveEmbed
			.setDescription(`**Automatyczne wychodzenie jest** \`${!autoLeave ? "WŁ" : "WYŁ"}\``)
			.setFooter({
			  text: `Bot będzie ${!autoLeave ? "automatycznie" : "nie automatycznie"} wychodził, gdy kanał głosowy jest pusty.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "autoLeave"
      )}] has been [${colors.blue(!autoLeave ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return interaction.reply({ embeds: [autoLeaveEmbed] });
  });

module.exports = command;