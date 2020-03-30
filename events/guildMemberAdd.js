module.exports = (client, member) => {
    const role = member.guild.roles.get(client.config.roles.WAITING)
    member.addRole(role).catch(console.error)
}