const {MessageEmbed} = require('discord.js');

Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element)
    }
};

function makePagedEncy(client, subtitle = "", itemPerPage = 15, comparer = function(ency) {return ency}) {
    const pages = [];
    let i = 0;
    let i1 = itemPerPage;

    const result = comparer(client.config.encyclopedia.sort((a, b) => a.name.localeCompare(b.name)));
    for (let i2 = 0; i2 < result.length; i2++) {
        if (i1 === i2 || i2 === (result.length - 1)) {
            const slicedEncy = [];
            result.slice(i, i1).forEach((serie) => {
                slicedEncy.push(`${serie.type.toLowerCase() === "film" ? "🎞️" : "📽️"} **${serie.type.toUpperCase()}** ${serie.note === -1 ? "" : `(${serie.note} ⭐)`} **»** ${serie.name}`)
            });
            const embed = new MessageEmbed()
                .setTitle(`Netflix Ency\' ${subtitle}`)
                .setURL('https://discord.gg/wV3V4m4')
                //.setImage(client.config.logo)
                //.setThumbnail('attachment://logo.png')
                .setDescription('Ca y est. J\'ai recensé tout ce dont je suis capable.')
                .addField(`Liste (${result.length})`, slicedEncy.join('\n'), true);
            pages.push(embed);
            i = i1;
            i1 = i1 + itemPerPage;
        }
    }
    return pages;
}

exports.run = (client, message, args) => {
    let ency = client.config.encyclopedia;
    if (!args || args.length < 1) {
        if (!message.member.roles.cache.some((role) => role.id === client.config.roles.TEAM)) ency = ency.filter(serie => serie.note !== -1);
        const pagination = require('../util/pagination');
        return pagination(message, makePagedEncy(client), 'Tu souhaites ajouter une série ? Utilise n!suggest');
    }
    if (args[0].toLowerCase() === "genre") {
        if (args.length > 1) {
            const genre = args[1];
            const result = [];
            ency.forEach(serie => {
                serie.styles.forEach(style => {
                    if (style.toUpperCase() === genre.toUpperCase()) {
                        result.push(serie)
                    }
                })
            });
            const pagination = require('../util/pagination');

            var pages = [];
            var i = 0;
            var i1 = 0 + 15;
            for (i2 = 0; i2 < result.length; i2++) {
                if (i1 == i2 || i2 == (result.length - 1)) {
                    var slicedResults = [];
                    result.slice(i, i1).forEach((serie) => {
                        slicedResults.push(`${serie.type.toLowerCase() === "film" ? "🎞️" : "📽️"} **${serie.type.toUpperCase()}** ${serie.note == -1 ? "" : `(${serie.note} ⭐)`} **»** ${serie.name}`)
                    });
                    const embed = new MessageEmbed()
                        .setTitle('Netflix Ency\' | RECHERCHE PAR GENRE ' + genre.toUpperCase())
                        .setURL('https://discord.gg/wV3V4m4')
                        //.setImage('./images/logo.png')
                        //.setThumbnail('attachment://logo.png')
                        .setDescription('Ca y est. J\'ai recensé tout ce dont je suis capable.')
                        .addField(`Liste (${result.length})`, slicedResults.join('\n'), true);
                    pages.push(embed);
                    i = i1;
                    i1 = i1 + 15
                }
            }
            return pagination(message, pages)
        }
        const genres = [];
        ency.forEach(serie => serie.styles.forEach(style => genres.pushIfNotExist(style, function (e) {
            return e.toLowerCase() === style.toLowerCase()
        })));
        const pagination = require('../util/pagination');

        var pages = [];
        var i = 0;
        var i1 = 0 + 10;
        for (i2 = 0; i2 < ency.length; i2++) {
            if (i1 == i2 || i2 == (genres.length - 1)) {
                var slicedGenres = genres.slice(i, i1);
                const embed = new MessageEmbed()
                    .setTitle('Netflix Ency\' | RECHERCHE PAR GENRE')
                    .setURL('https://discord.gg/wV3V4m4')
                    //.setImage('./images/logo.png')
                    //.setThumbnail('attachment://logo.png')
                    .setDescription('Ca y est. J\'ai recensé tout ce dont je suis capable.')
                    .addField(`Liste (${genres.length})`, slicedGenres.slice(0, slicedGenres.length >= 5 ? 5 : (slicedGenres.length)).join('\n') + " ", true);
                if (slicedGenres.length >= 5) embed.addField('\u200b', slicedGenres.slice(5, slicedGenres.length).join('\n') + " ", true);
                pages.push(embed);
                i = i1;
                i1 = i1 + 10
            }
        }
        return pagination(message, pages)
    }
    const arg = args.join(" ");

    const pagination = require('../util/pagination');
    const comparer = function(ency) {
        return ency.filter(serie => serie.name.toLowerCase().includes(arg.toLowerCase()));
    };
    return pagination(message, makePagedEncy(client, '| ' + arg.toUpperCase(), 15, comparer), 'Tu souhaites ajouter une série ? Utilise n!suggest');
};