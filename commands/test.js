exports.run = (client, message, args) => {
    const collector = message.createReactionCollector(
        (reaction, user) => true,
        {time: 300000}
    )
    collector.on("collect", (reaction, collector) => {
        console.log(reaction)
    })
}