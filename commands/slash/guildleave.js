const { MessageEmbed, message } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const fs = require("fs");
const path = require("path");
const { forEach } = require("lodash");

const command = new SlashCommand()
	.setName("guildleave")
	.setDescription("opuszcza serwer")
    .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter the guild id to leave (type `list` for guild ids)")
      .setRequired(true)
  )
  .setRun(async (client, interaction, options) => {
		if (interaction.user.id === client.config.adminId) {
		    try{
			const id = interaction.options.getString('id');

			if (id.toLowerCase() === 'list'){
			    client.guilds.cache.forEach((guild) => {
				console.log(`${guild.name} | ${guild.id}`);
			    });
			    const guild = client.guilds.cache.map(guild => ` ${guild.name} | ${guild.id}`);
			    try{
				return interaction.reply({content:`Serwery:\n\`${guild}\``, ephemeral: true});
			    }catch{
				return interaction.reply({content:`Sprawdź w konsoli listę serwerów`, ephemeral: true});
			    }
			}

			const guild = client.guilds.cache.get(id);

			if(!guild){
			    return interaction.reply({content: `\`${id}\` nie jest prawidłowym identyfikatorem gildii`, ephemeral:true});
			}

			await guild.leave().then(c => console.log(`opuszczono gildię ${id}`)).catch((err) => {console.log(err)});
			return interaction.reply({content:`opuszczono gildię \`${id}\``, ephemeral: true});
		    }catch (error){
			console.log(`Wystąpił błąd podczas próby opuszczenia gildii ${id}`, error);
		    }
		}else {
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
