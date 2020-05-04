const Constants = require('discord.js/src/util/Constants.js')

Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};

function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }

    return true;
}

function buildStrings(strings) {
    let result = "";
    return result.concat(strings);
}

exports.run = (client, message, args) => {
    if (!args || args.length < 1) {
        return message.reply('error');
    }
    if (args[0] === 'add') {
        if (client.presence.presences.length >= 5) {
            return message.reply('error to many presences');
        }
        args = args.splice(0);
        const type = 'WATCHING', url = '', content = '';

        if (Constants.ActivityTypes.contains(args[1].toUpperCase())) {
            type = args[1].toUpperCase();
        }
        if (args.length > 3 && type === 'STREAMING' && isValidUrl(args[2])) {
            url = args[2];
        }
        content = buildStrings(url ? args.splice(args.indexOf(type)).splice(args.indexOf(url)) : args.splice(args.indexOf(type)));

        client.presence.addGame(content, type, url)
    }
    if (args[0] === 'remove') {}
}