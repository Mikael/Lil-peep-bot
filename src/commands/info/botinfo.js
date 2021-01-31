const { MessageEmbed } = require('discord.js')
const config = require('../../config');
const mongo = require('../../handlers/mongo');
const imagesSchema = require('../../schemas/images-schema');

module.exports = {
    name : 'botinfo',
    category : 'info',
    description : 'Get the bot data',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        await mongo().then(async (mongoose) => {
            try {
                result = await imagesSchema.findOne({ _id: message.guild.id })
            } finally {
                mongoose.connection.close();
            }
        });

        message.delete();

        let sendImages = result.sendImages,
            imageChannel = client.channels.cache.get(result.imageChannel),
            timerInSec = parseInt(result.timerInSec),
            botOwner = client.users.cache.get(config.botAdmin);

        const embed = new MessageEmbed()
            .setColor('#28a745')
            .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
            .setDescription('**All information about the bot settings.**')
            .setTimestamp()
            .addFields(
                { name: 'Send the images', value: sendImages, inline: true },
                { name: 'The image channel', value: '<#' + imageChannel.id + '>', inline: true },
                { name: 'Timer in seconds', value: timerInSec, inline: true },
                { name: 'Owner of the bot', value: '<@' + '536194730892197908' + '>' },
            )
        message.channel.send({embed: embed});

    }
}