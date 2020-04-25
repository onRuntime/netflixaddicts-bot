exports.run = (client, message, args) => {
    if(!message.member.voice.channel) {
        message.reply('tu dois rejoindre un salon pour utiliser cette commande')
        return
    }
    message.member.voice.channel.join()
}