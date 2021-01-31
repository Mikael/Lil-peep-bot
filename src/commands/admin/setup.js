const { MessageEmbed } = require('discord.js')

const mongo = require('../../handlers/mongo');
const imagesSchema = require('../../schemas/images-schema');

module.exports = {
    name : 'setup',
    category : 'admin',
    description : 'Setup the bot data',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        message.delete();

        if (message.member.hasPermission('ADMINISTRATOR')) {
            await mongo().then(async (mongoose) => {
                try {
                    await imagesSchema.findOneAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        sendImages: false,
                        imageChannel: "",
                        timerInSec: 60,
                    }, {
                        upsert: true
                    })

                    const embed = new MessageEmbed()
                        .setColor('#28a745')
                        .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                        .setDescription('**Bot setup succeeded**')
                        .setTimestamp()
                    message.channel.send({embed: embed});
                } finally {
                    mongoose.connection.close();
                }
            });
        } else {
            const embed = new MessageEmbed()
                .setColor('#dc3545')
                .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                .setDescription('**You are lacking the permission ADMINISTRATOR.**')
                .setTimestamp()
            message.channel.send({embed: embed});
        }
    }
}