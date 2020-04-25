const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const client = new Discord.Client();

const data = require('./data.json');
client.config = data;

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

const dotenv = require('dotenv');
dotenv.config();
client.login(process.env.TOKEN);