module.exports = (client, reaction, user) => {
    switch(reaction.message.id) {
        case "533007573415362581":
            if(reaction.emoji.name === 'spoil') {
                const role = reaction.message.guild.roles.resolve(client.config.roles.ZONE51)
                reaction.message.guild.members.resolve(user.id).roles.remove(role)
            }
            break
    }
}