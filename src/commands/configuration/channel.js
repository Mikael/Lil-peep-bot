const { MessageEmbed } = require('discord.js')
const fs = require('fs');
const mongo = require('../../handlers/mongo');
const imagesSchema = require('../../schemas/images-schema');

// function jsonReader(filePath, cb) {
//     fs.readFile(filePath, 'utf-8', (err, fileData) => {
//         if (err) {
//             return cb && cb(err);
//         }
//         try {
//             const object = JSON.parse(fileData);
//             return cb && cb(null, object);
//         } catch (err) {
//             return cb && cb(err);
//         }
//     });
// }

module.exports = {
    name : 'channel',
    category : 'configuration',
    description : 'Define the channel',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        message.delete();

        let channel = message.mentions.channels.first();

        if (channel != null) {
            // jsonReader('./src/configs/images.json', (err, data) => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         data.image_channel = channel.id;
            //         fs.writeFile('./src/configs/images.json', JSON.stringify(data, null, 2), err => {
            //             if (err) {
            //                 console.log(err);
            //             } else {
                            // const embed = new MessageEmbed()
                            //     .setColor('#28a745')
                            //     .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                            //     .setDescription('**Channel** <#' + channel.id + '> **has been successfully set as the photo channel.**')
                            //     .setTimestamp()
                            //     .setFooter('Channel ID: ' + channel.id)
                            // message.channel.send({embed: embed});
            //             }
            //         });
            //     }
            // })

            let channelImage = channel.id;

            await mongo().then(async (mongoose) => {
                try {
                    await imagesSchema.findOneAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        imageChannel: channelImage,
                    }, {
                        upsert: true
                    })

                    const embed = new MessageEmbed()
                        .setColor('#28a745')
                        .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                        .setDescription('**Channel** <#' + channel.id + '> **has been successfully set as the photo channel.**')
                        .setTimestamp()
                        .setFooter('Channel ID: ' + channel.id)
                    message.channel.send({embed: embed});
                } finally {
                    mongoose.connection.close();
                }
            });
        } else {
            const embed = new MessageEmbed()
                .setColor('#dc3545')
                .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                .setDescription('**You need to define a valid channel.**')
                .setTimestamp()
            message.channel.send({embed: embed});
        }

    }
}