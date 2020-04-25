exports.run = (client, message, args) => {
    client.channels.fetch('531897661284941846').then(channel => {
        channel.createInvite({
            temporary: false,
            maxAge: 0
        }).then(invite => message.reply(`je viens de générer ton invitation \`${invite.url}\``)).catch(console.error)
    })
}