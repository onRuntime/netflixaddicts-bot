module.exports = (client, member) => {
    const memberListCategory = member.guild.channels.get(client.config.member_list.category)
    memberListCategory.setName(`${client.config.member_list.name} (${member.memberCount} membres)`)

    const role = member.guild.roles.get(client.config.roles.WAITING)
    member.addRole(role).catch(console.error)
}