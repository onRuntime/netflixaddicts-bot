import { ParsedMessage } from 'discord-command-parser';
import { IBotPlugin, IBot } from '../resources';
import { GuildMember, CategoryChannel, TextChannel, VoiceChannel, Message, Guild, Client, VoiceState, GuildChannel } from 'discord.js';

export default class PrivateChannelPlugin implements IBotPlugin {

    channels: Map<string, PrivateChannel>;

    initialize(bot: IBot): void {
        this.channels = new Map();
    }

    enable(bot: IBot): void {
        bot.commands.on('private', (command: ParsedMessage<Message>, message: Message) => {
            if(!command.success) return;

            const args = command.arguments;

            if(!args || args.length < 1) {
                return;
            }
            if(args[0].toLowerCase() === 'create') {
                const channel = new PrivateChannel(bot.client, message.member);
                this.channels.set(message.member.id, channel);
                return;
            }
            if(args[0].toLowerCase() === 'add') {
                const channel = this.channels.get(message.member.id);
                channel.addMember(message.mentions.members.first());
            }
            if(args[0].toLowerCase() === 'remove') {
                const channel = this.channels.get(message.member.id);
                channel.removeMember(message.mentions.members.first());
            }
            if(args[0].toLowerCase() === 'delete') {
                const channel = this.channels.get(message.member.id);
                channel.delete();
                this.channels.delete(message.member.id);
                return;
            }
        });
    }

    disable(bot: IBot): void {}
}

class PrivateChannel {

    private owner: GuildMember;
    private members: GuildMember[];

    private category: CategoryChannel;
    private textChannel: TextChannel;
    private voiceChannel: VoiceChannel;

    protected baseTime: number = 360;
    private time: number = this.baseTime;
    protected interval: NodeJS.Timeout;

    constructor(client: Client, owner: GuildMember) {
        this.owner = owner;
        this.members = [];

        const guild: Guild = owner.guild;
        owner.guild.channels.create('PRIVATE - ' + owner.displayName, {type: 'category', permissionOverwrites: [
            {
                id: guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: owner.id,
                allow: ['VIEW_CHANNEL'],
            }
        ]})
            .then(async (category: CategoryChannel) => {
                this.category = category;

                await guild.channels.create('général', {type: 'text', parent: category}).then((textChannel: TextChannel) => {
                    this.textChannel = textChannel;
                    textChannel.send('welcome bg');

                    client.on('message', (message: Message) => {
                        if(message.channel.id === textChannel.id) this.time = this.baseTime;
                    });
                });
                await guild.channels.create('🔊 Général', {type: 'voice', parent: category}).then((voiceChannel: VoiceChannel) => {
                    this.voiceChannel = voiceChannel;
                    if(owner.voice.connection) owner.voice.setChannel(voiceChannel);

                    client.on('voiceStateUpdate', (oldMember: VoiceState, newMember: VoiceState) => {
                        if(oldMember.channel && oldMember.channel.id === voiceChannel.id || newMember.channel && newMember.channel.id === voiceChannel.id) this.time = this.baseTime;
                    })
                });

                this.interval = setInterval(() => {
                    if(this.time <= 0) {
                        this.delete().then(() => {
                            owner.send('Ton salon a été détruit bg');
                        })
                    }
                    if(this.voiceChannel.members.size === 0) this.time--;
                }, 1000);
            })
            .catch();
    }

    requestMember(member: GuildMember) {}

    public addMember(member: GuildMember) {
        this.category.overwritePermissions([
            {
                id: member.id,
                allow: ['VIEW_CHANNEL'],
            }
        ]).then((category: CategoryChannel) => {
            category.children.forEach((channel: GuildChannel) => channel.lockPermissions());
            this.members.push(member);
        });
    }

    public removeMember(member: GuildMember) {
        this.members = this.members.filter((member1: GuildMember) => member1.id !== member.id);
        this.category.permissionsFor(member).remove();
        this.category.children.forEach((channel: GuildChannel) => channel.lockPermissions());
    }

    delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            clearInterval(this.interval);

            // Delete channels
            this.voiceChannel.delete().then(() => this.textChannel.delete().then(() => this.category.delete()));
        });
    }
}