const PrivateChannel = require('../util/PrivateChannel.js')

const Enmap = require('enmap')
const channels = new Enmap()

exports.run = async (client, message, args) => {
    if(args[0] === 'create') {
        if(channels.has(message.member.id)) {
            return message.reply('tu as déjà un salon privé, je t\'ai mentionné afin que tu le retrouves ;)')
        }
        channels.set(message.member.id, new PrivateChannel(client, message.member))
    }
    if(args[0] === 'delete') {
        if(!channels.has(message.member.id)) {
            return message.reply('tu n\'as pas de salon privé')
        }
        const private = channels.get(message.member.id)
        channels.remove(message.member.id)
        await private.voiceChannel.delete()
        await private.textChannel.delete()
        private.category.delete().then(result => message.reply('ton salon privé a été supprimé'))
        return
    }
    if(args[0] === 'add') {}
    if(args[0] === 'kick' || args[0] === 'remove') {}
}