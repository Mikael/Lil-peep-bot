const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name : 'enable',
    category : 'admin',
    description : 'Enable an command',

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {

        message.delete();

        jsonReader('./src/config.json', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                if (message.author.id !== data.botAdmin) return message.author.send("You don't have permission to execute this command.");
                if (!args[0]) return message.author.send("You must input a category (run !help).");
                if (!args[1]) return message.author.send("You must input a command name (run !help).");
        
                let category = args[0].toLowerCase();
                let command = args[1].toLowerCase();
        
                try {
                    const pull = require(`../../commands/${category}/${command}.js`);
                    client.commands.set(command, pull);
        
                    return message.channel.send(`Done enabling **${command}**`);
                } catch (error) {
                    return message.channel.send(`Error enabling **${command}**: \`${error.message}\``);
                }
            }
        })
    }
}