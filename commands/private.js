const PrivateChannel = require('../util/PrivateChannel.js')

exports.run = async (client, message, args) => {
    const channels = client.privateChannels
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
        private.delete().then(result => message.reply('ton salon privé a été supprimé'))
        channels.delete(message.member.id)
        return
    }
    if(args[0] === 'add') {
        if(!channels.has(message.member.id)) {
            return message.reply('tu n\'as pas de salon privé')
        }
    }
    if(args[0] === 'kick' || args[0] === 'remove') {
        if(!channels.has(message.member.id)) {
            return message.reply('tu n\'as pas de salon privé')
        }
    }
}