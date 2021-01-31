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
    name : 'toggle',
    category : 'configuration',
    description : 'Toggle the image sender',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        message.delete();

        let argsLength = args.length;

        if (argsLength === 1) {
            if (args[0] == 'on') {
                // jsonReader('./src/configs/images.json', (err, data) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         data.send_images = true;
                //         fs.writeFile('./src/configs/images.json', JSON.stringify(data, null, 2), err => {
                //             if (err) {
                //                 console.log(err);
                //             } else {
                //                 const embed = new MessageEmbed()
                //                     .setColor('#28a745')
                //                     .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                //                     .setDescription('**Images are now enabled.**')
                //                     .setTimestamp()
                //                 message.channel.send({embed: embed});
                //             }
                //         });
                //     }
                // });

                await mongo().then(async (mongoose) => {
                    try {
                        await imagesSchema.findOneAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            sendImages: true,
                        }, {
                            upsert: true
                        })

                        const embed = new MessageEmbed()
                            .setColor('#28a745')
                            .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                            .setDescription('**Images are now enabled.**')
                            .setTimestamp()
                        message.channel.send({embed: embed});
                    } finally {
                        mongoose.connection.close();
                    }
                });
            } else if (args[0] == 'off') {
                // jsonReader('./src/configs/images.json', (err, data) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         data.send_images = false;
                //         fs.writeFile('./src/configs/images.json', JSON.stringify(data, null, 2), err => {
                //             if (err) {
                //                 console.log(err);
                //             } else {
                //                 const embed = new MessageEmbed()
                                    // .setColor('#28a745')
                                    // .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                                    // .setDescription('**Images are now disabled.**')
                                    // .setTimestamp()
                //                 message.channel.send({embed: embed});
                //             }
                //         });
                //     }
                // });

                await mongo().then(async (mongoose) => {
                    try {
                        await imagesSchema.findOneAndUpdate({
                            _id: message.guild.id
                        }, {
                            _id: message.guild.id,
                            sendImages: false,
                        }, {
                            upsert: true
                        })

                        const embed = new MessageEmbed()
                            .setColor('#28a745')
                            .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                            .setDescription('**Images are now disabled.**')
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
                    .setDescription('**You need to enter a valid argument (on/off)**')
                    .setTimestamp()
                message.channel.send({embed: embed});
            }
        } else {
            const embed = new MessageEmbed()
                .setColor('#dc3545')
                .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
                .setDescription('**You need to enter a valid argument (on/off)**')
                .setTimestamp()
            message.channel.send({embed: embed});
        }

    }
}