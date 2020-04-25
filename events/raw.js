module.exports = (client, packet) => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    client.channels.fetch(packet.d.channel_id).then(channel => {
        if (channel.messages.resolve(packet.d.message_id) != null) return;
        channel.messages.fetch(packet.d.message_id).then(message => {
            const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
            const reaction = message.reactions.resolve(emoji);
            if (reaction) reaction.users.set(packet.d.user_id, client.users.resolve(packet.d.user_id));
            if (packet.t === 'MESSAGE_REACTION_ADD') {
                client.emit('messageReactionAdd', reaction, client.users.resolve(packet.d.user_id));
            }
            if (packet.t === 'MESSAGE_REACTION_REMOVE') {
                client.emit('messageReactionRemove', reaction, client.users.resolve(packet.d.user_id));
            }
        });
    });
}