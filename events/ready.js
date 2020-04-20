module.exports = (client) => {
    const guild = client.guilds.resolve(client.config.guild)
    const memberListCategory = guild.channels.resolve(client.config.member_list.category)
    memberListCategory.setName(`${client.config.member_list.name} (${guild.memberCount} membres)`)

    console.log(`Ready from ${client.user.tag}!`)
}