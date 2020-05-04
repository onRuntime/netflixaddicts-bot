const Discord = require('discord.js');
const Twitter = require('twitter');

const dotenv = require('dotenv');

dotenv.config();
client = new Discord.Client();
twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const Enmap = require('enmap');
const Presence = require('./util/Presence.js');

const fs = require('fs');

const data = require('./data.json');

function setup() {
  client.config = data;

  client.presence = new Presence.Module(client);
}

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.privateChannels = new Enmap();

twitter.stream('statuses/filter', { follow: ['2341888057'] }, (stream) => {
  stream.on('data', event => {
    console.log(event && event.text);
  });

  stream.on('error', error => {
    console.error
  })
});

setup();
client.login(process.env.TOKEN);