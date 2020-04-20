var data = require('../data.json')
data = data.privates

var category
var voiceChannel
var textChannel

async function PrivateChannel(member) {
    category = await member.guild.channels.create('PRIVÉ - ' + member.name, {
        type: "category"
    })
    voiceChannel = await member.guild.channels.create("🔊 Général", {
        type: "voice",
        parent: category.id
    })
    textChannel = await member.guild.channels.create("discussion", {
        type: "text",
        parent: category.id
    })
}
module.exports = PrivateChannel