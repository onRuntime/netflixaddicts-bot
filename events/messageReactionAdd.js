module.exports = (client, reaction, user) => {
    switch(reaction.message.id) {
        case "532288637283336192":
            console.log(reaction)
            console.log(reaction.id)
            console.log(reaction.identifier)
            console.log(reaction.name)
            break
    }
}