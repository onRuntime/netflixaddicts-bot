import { IBotPlugin, IBot, isValidUrl, buildStrings } from '../resources';
import { ParsedMessage } from 'discord-command-parser';
import { Message, Constants } from 'discord.js';

export default class PresencePlugin implements IBotPlugin {

    initialize(bot: IBot): void { }

    enable(bot: IBot): void {
        bot.commands.on('presence', (command: ParsedMessage<Message>, message: Message) => {
            if (!command.success) return;

            const client = bot.client;
            let args = command.arguments;
            if (!args || args.length < 1) {
                return message.reply('error');
            }
            if (args[0] === 'add') {
                args = args.splice(0);
                let type: number | "WATCHING" | "PLAYING" | "STREAMING" | "LISTENING" | "CUSTOM_STATUS" = 'WATCHING', url = '', content = '';

                if (Constants.ActivityTypes[args[1].toUpperCase()]) {
                    type = Constants.ActivityTypes[args[1].toUpperCase()];
                }
                if (args.length > 3 && type === 'STREAMING' && isValidUrl(args[2])) {
                    url = args[2];
                }
                content = buildStrings(url ? args.splice(args.indexOf(type.toString())).splice(args.indexOf(url)) : args.splice(args.indexOf(type.toString())));
                
                client.user.setPresence({activity: {name: content, type: type, url: url}});
            }
        });
    }

    disable(bot: IBot): void {
        const client = bot.client;
        client.user.setActivity(null);
    }
}