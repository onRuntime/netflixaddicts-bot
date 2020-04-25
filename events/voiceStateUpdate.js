const PrivateChannel = require('../util/PrivateChannel.js')

module.exports = (client, oldMember, newMember) => {
    const newUserChannel = newMember.voiceChannel
    const oldUserChannel = oldMember.voiceChannel
  
    if(oldUserChannel === undefined && newUserChannel !== undefined) { // User joined a channel
        switch(newUserChannel.id) {
            case '699609413740265562':
                if(client.privateChannels.has(newMember.id)) {
                    const private = client.privateChannels.get(newMember.id)
                    newMember.setVoiceChannel(private.voiceChannel)
                    break
                }
                client.privateChannels.set(newMember.id, new PrivateChannel(client, newMember))
                break
        }
    } else if(newUserChannel === undefined) { // User left a channel
    }
}