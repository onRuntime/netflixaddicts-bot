module.exports = (client, member) => {
    const memberListCategory = member.guild.channels.get(client.config.member_list.category)
    memberListCategory.setName(`${client.config.member_list.name} (${member.memberCount - 1} membres)`)
}