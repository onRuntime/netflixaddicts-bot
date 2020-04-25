let data = require('../data.json')
data = data.privates

class PrivateChannel {
    constructor(client, member) {
        member.guild.channels.create('PRIVÉ - ' + member.user.username, {
            type: "category"
        }).then(result => {
            this.category = result;
            member.guild.channels.create("🔊 Général", {
                type: "voice",
                parent: this.category.id
            }).then(result => this.voiceChannel = result);
            member.guild.channels.create("discussion", {
                type: "text",
                parent: this.category.id
            }).then(result => this.textChannel = result);
        }).catch(console.error);

        this.time = 3600
        setInterval(async () => {
            if(this.time == 0) {
                clearInterval()
                await this.voiceChannel.delete()
                await this.textChannel.delete()
                await this.category.delete()
            }
            this.time--
        }, 1000)

        client.on('message', (message) => {
            if(message.id !== this.textChannel.id) return
            this.time = 3600
        })
    }
}

module.exports = PrivateChannel