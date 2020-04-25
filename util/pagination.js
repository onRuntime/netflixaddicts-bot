const paginationEmbed = async (message, pages, subfooter, emojis = ['⏪', '⬅', '➡', '⏩'], timeout = 300000) => {
    if (!message && !message.channel) throw new Error('Channel not accessible!');
    if (!pages) throw new Error('Undefined pages!');
    if (emojis.length > 4) throw new Error('Two emojis are needed!');

    let page = 0;
    let reactionCollector = null;
    const current = message.channel
        .send(pages[page].setFooter(`📖 Page ${page + 1} sur ${pages.length} ${subfooter ? ` | ` + subfooter : ``}`))
        .then(async (result) => {
            if(pages.size > 1) {
                for (const emoji of emojis) await result.react(emoji);
            }
            reactionCollector = result.createReactionCollector(
                (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot,
                {time: timeout}
            );
            reactionCollector.on('collect', reaction => {
                reaction.users.remove(message.author.id);
                switch (reaction.emoji.name) {
                    case emojis[0]:
                        page = 0;
                        break;
                    case emojis[1]:
                        page = page > 0 ? --page : pages.length - 1;
                        break;
                    case emojis[2]:
                        page = page + 1 < pages.length ? ++page : 0;
                        break;
                    case emojis[3]:
                        page = pages.length - 1;
                        break;
                }
                result.edit(pages[page].setFooter(`📖 Page ${page + 1} sur ${pages.length} ${subfooter ? ` | ` + subfooter : ``}`));
            });
            reactionCollector.on('end', () => result.reactions.removeAll());
        });
    return current;
};
module.exports = paginationEmbed;