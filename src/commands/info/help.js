const { MessageEmbed } = require('discord.js')
const config = require('../../config');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');

module.exports = {
    name : 'help',
    category : 'info',
    description : 'Run the help command',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        message.delete();

        const embed = new MessageEmbed()
            .setColor('#28a745')
            .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
            .setDescription('**Command information**')
            .setTimestamp()
            .addFields(
                { name: '`!channel <#channel>`', value: "Define the channel (category: configuration)" },
                { name: '`!interval <sec>`', value: "Set the image interval in seconds (category: configuration)s" },
                { name: '`!toggle [on/off]`', value: 'Toggle the images (category: configuration)' },
                { name: '`!botinfo`', value: 'Displays the current bot configuration (category: info)' },
                { name: '`!help`', value: 'Shows this message (category: info)' },
                { name: '`!reload <category> <command>`', value: 'Reload an specific command' },
                { name: '`!setup`', value: 'First time setup command' }
            )
        message.channel.send({embed: embed});

    }
}