import { CommandMap } from './command-map';
import { requireFile, readDir, IBot, BotConfig, IBotPlugin } from '../resources';
import { Client, Message, GuildChannel } from 'discord.js';
import { parse, ParsedMessage } from 'discord-command-parser';
import * as dotenv from "dotenv";
import { logger } from './logger';

export class Bot implements IBot {
    config: BotConfig;
    client: Client;
    commands: CommandMap;
    online: boolean;
    plugins: IBotPlugin[];

    constructor(config: BotConfig) {
        this.config = config;
        this.client = new Client();
        this.commands = new CommandMap();

        let files = readDir('./dist/plugins');
        if (files) {
            this.plugins = files
                .filter(file => !file.includes('.map'))
                .map(file => requireFile('./dist/plugins', file).default)
                .map(construct => new construct());
        }

        this.plugins.forEach(plugin => plugin.initialize(this));
        this.client
            .on("error", (e) => console.error(e))
            .on("warn", (e) => console.warn(e))
            .on("debug", (e) => console.info(e))
            .on('ready', () => {
                if (this.online)
                    logger.debug('Bot reconnected!');
                else
                    logger.debug('Bilberry is online');
                this.online = true;
                this.plugins.forEach(plugin => plugin.enable(this));
            })
            .on('message', (message: Message) => {
                let parsed = parse(message, this.config.command.symbol);
                if (!parsed.success) return;
                let handlers = this.commands.get(parsed.command);
                if (handlers) {
                    logger.debug(`Command handled: ${message.content}`);
                    handlers.forEach(handle => handle(parsed, message));
                }
            });

        this.commands
            .on('ping', (command: ParsedMessage<Message>, message: Message) => {
                message.reply('pong!');
            })
            .on('plugin', (command: ParsedMessage<Message>, message: Message) => {
                if(!command.success) return;
                const args = command.arguments;
                //TODO: plugins command



                
            }, ['plugins', 'pl'], ['ADMINISTRATOR'])
            .on('invite', (command: ParsedMessage<Message>, message: Message) => {
                this.client.channels.fetch('531897661284941846').then((channel: GuildChannel) => {
                    channel.createInvite({
                        temporary: false,
                        maxAge: 0
                    }).then(invite => message.reply(`je viens de générer ton invitation \`${invite.url}\``)).catch(console.error)
                })
            })
            .on('stop', (command: ParsedMessage<Message>, message: Message) => {
                this.stop();
            }, ['end', 'shutdown'], ['ADMINISTRATOR']);
    }

    connect(): Promise<string> {
        dotenv.config();
        return this.client.login(process.env.TOKEN);
    }

    stop() {
        logger.debug('Bot diconnecting...');
        logger.debug('Stopping plugins...');
        this.plugins.forEach(plugin => plugin.disable(this));
        logger.debug('Plugins stopped!');

        logger.debug('Client destroying...');
        this.client.destroy();
        console.log('Bot disconnected!');
    }
}