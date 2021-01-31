const { MessageEmbed } = require('discord.js')
const fs = require('fs');

function jsonReader(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

module.exports = {
    name : 'disable',
    category : 'admin',
    description : 'Disable an command',

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
                    delete require.cache[require.resolve(`../../commands/${category}/${command}.js`)];
                    client.commands.delete(command);
        
                    return message.channel.send(`Done disabling **${command}**`);
                } catch (error) {
                    return message.channel.send(`Error disabling **${command}**: \`${error.message}\``);
                }
            }
        })
    }
}