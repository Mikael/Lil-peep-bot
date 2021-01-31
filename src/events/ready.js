const client = require('../../src/index');
const { CronJob } = require('cron');
const async = require('async');
const cheerio = require('cheerio');
const request = require('request');
const officialConfig = require('../config');
const { Message, MessageEmbed } = require('discord.js');
const mongo = require('../handlers/mongo');
const imagesSchema = require('../schemas/images-schema');
const config = require('../config');

const Discord = require('discord.js');
const dBot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

client.on('ready', () => {
    console.log(`${client.user.tag} is now online!`);

    let guilds = client.guilds.cache.array();
    
    mongo().then(async (mongoose) => {
        for (let i = 0; i < guilds.length; i++) {
            try {
                let result = await imagesSchema.findOne({ _id: guilds[i].id })

                if (result != null) {

                    let sendImageBool = result.sendImages,
                        date_ob = new Date(),
                        hours = ('0' + date_ob.getHours()).slice(-2),
                        minutes = ('0' + date_ob.getMinutes()).slice(-2),
                        seconds = ('0' + date_ob.getSeconds()).slice(-2),
                        ms = result.timerInSec * 1000;
        
                    if (result.imageChannel != "" && sendImageBool && ms != null) {
                        setInterval(() => {
                            currTime = hours + ":" + minutes + ":" + seconds;
                            console.log("[" + currTime + "] Image posted");
                            image(result);
                        }, ms);
                    } else if (result.imageChannel != "") {
                        client.users.cache.get(config.botAdmin).send("**Error:** No channel has been defined yet. Use !channel #channel-tag to set a channel.");
                    } else if (sendImageBool == false) {
                        return;
                    }
                }
            } finally {
                // mongoose.connection.close();
            }
        }
    });
});

function image(result) {
    let options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "lilpump",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };

    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }

        $ = cheerio.load(responseBody);

        let links = $(".image a.link");

        let urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        if (!urls.length) {
            return;
        }

        // Send result
        const embed = new MessageEmbed()
            .setColor('#28a745')
            .setAuthor(client.user.username, 'https://cdn.discordapp.com/avatars/' + client.user.id + '/' + client.user.avatar + '.png?size=128')
            .setImage(urls[Math.floor(Math.random() * urls.length)])
            .setTimestamp()

        client.channels.cache.get(result.imageChannel).send({embed: embed});
    });
}