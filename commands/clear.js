exports.run = (client, message, args) => {
    if(!message.channel.permissionsFor(message.author).has('MANAGE_MESSAGES')) {
        message.reply('tu n\'as pas la permission pour executer cette commande...')
        return
    }
    if(!args || args.length < 1 || isNaN(args[0]) || args[0] < 1 || args[0] > 100) {
        message.reply('Tu dois indiquer un nombre compris entre 1 et 100 inclu. `' + client.config.prefix + 'help clear`')
        return
    }
    message.channel.bulkDelete(args[0])
        .then(messages => message.reply(`tu viens de supprimer ${messages.size} messages dans ce salon.`)
            .then(result => result.delete({timeout: 5000}))
        )
        .catch((error) => {
            message.channel.messages.fetch({limit: args[0]})
                .then(async messages => {
                    for(const toDelete of messages) {
                        console.log(toDelete)
                        await toDelete.delete()
                    }
                    message.reply(`tu viens de supprimer ${messages.size} messages dans ce salon.`)
                })
                .catch(console.error)
        });
}