import { Hydratable } from './../iteration/config';
import { Message, GuildMember, Role, MessageEmbed } from 'discord.js';
import { ParsedMessage } from 'discord-command-parser';
import { PaginationEmbed } from 'discord-paginationembed';
import { IBotPlugin, IBot, readJson } from '../resources';

export default class EncyclopediaPlugin implements IBotPlugin {

    ency: Encyclopedia;

    initialize(bot: IBot): void {
        this.ency = new Encyclopedia(readJson('./data.json').encyclopedia);
    }

    enable(bot: IBot): void {
        const client = bot.client;
        bot.commands.on('ency', (command: ParsedMessage<Message>, message: Message) => {
            if(!command.success) return;
            const args = command.arguments;

            message.channel.send('Je prends un temps pour analyser ta requête. Patientes quelques secondes...').then((response) => {
                let search: string;

                if(args || args.length > 0) {
                    search = args.join(' ');
                }
                if(args && args.length > 1 && args[0].toLowerCase() === 'genre') {
                    search.substring(1);
                    this.ency.searchStyle(search).then((result: SearchResult<string>) => {
                        result.createPagination('Tu souhaites ajouter une série ? Utilise n!suggest', 5, true).then((pagination: PaginationEmbed<unknown>) => {
                            response.edit(pagination.build());
                        });
                    }).catch((reason) => {
                        response.edit(reason);
                    });
                    return;
                }
                this.ency.search(search).then((result: SearchResult<EncyItem>) => {
                    result.createPagination('Tu souhaites ajouter une série ? Utilise n!suggest').then((pagination: PaginationEmbed<unknown>) => {
                        response.edit(pagination.build());
                    });
                }).catch((reason) => {
                    response.edit(reason);
                });
            });
        });
    }       

    disable(bot: IBot): void {}
}

class Encyclopedia {

    items: Array<EncyItem>;

    constructor(ency: string[][]) {
        this.items = new Array<EncyItem>();
        ency.forEach(element => {
            const item: EncyItem = new EncyItem(element);
            this.items.push(item);
        });
    }

    async search(title?: string, member?: GuildMember): Promise<SearchResult<EncyItem>> {
        let result = this.items;
        return new Promise((resolve, reject) => {
            // Comparators
            if(member && !member.roles.cache.some((role) => role.id === '531893141356412929')) result = result.filter((item) => item.note !== -1);
            if(title && title.length > 0) result = result.filter((item) => item.name.toLowerCase().includes(title.toLowerCase()));

            const searchResult = new SearchResult<EncyItem>(title);
            if(!result || result.length == 0) reject('Aucun résultat');
            searchResult.setResult(result);
            resolve(searchResult);
        });
    }

    async searchStyle(style?: string): Promise<SearchResult<string>> {
        return new Promise((resolve, reject) => {});
    }
}

class EncyItem extends Hydratable {
    id: number;
    name: string;
    type: string;
    title: string;
    image: URL | string;
    note: number | null;
    styles: Array<string> | [];
    synopsis: string | string[];
    info: {
        seasons: number;
        episodes: number;
        age: number;
        episode_time: number;
        producers: string[];
    }
    authors: string[];
    date: Date;

    constructor(elements: string[]) {
        super(elements);
    }
}

class SearchResult<T extends EncyItem | string> {

    search: string;
    result: T[];

    constructor(search: string) {
        this.search = search;
    }

    setResult(result: T[]): void { this.result = result; }

    async createPagination(footer?: string, itemsPerPage: number = 15, inline = false): Promise<PaginationEmbed<unknown>> {
        const embeds: MessageEmbed[] = [];

        let i: number = 0;
        let i1: number = itemsPerPage;
        for(let i2: number = 0; i2 < this.result.length; i2++) {
            if(i1 === i2 || i2 === (this.result.length - 1)) {
                const slicedItems: string[] = [];
                this.result.slice(i, i1).forEach((item: T) => {
                    if(item instanceof EncyItem) {
                        slicedItems.push(`${item.type.toLowerCase() === 'film' ? '🎞️' : '📽️'} **${item.type.toUpperCase()}** ${item.note < 0 ? '' : `(${item.note} ⭐)`} **»** ${item.name}`);
                    } else {
                        slicedItems.push(`${item.toString().toUpperCase()}`);
                    }
                });
                const embed: MessageEmbed = new MessageEmbed()
                    .setTitle(`Netflix Ency' ${this.search.toUpperCase()}`)
                    .setURL('https://discord.gg/wV3V4m4')
                    .setDescription('Ca y est, j\'ai recensé tout ce dont je suis capable.')
                    .addField(`Liste (${this.result.length})`, slicedItems.join('\n'), true)
                    .setFooter(footer);
                //if(inline && slicedItems.length >= 5) embed.addField('\u200b', slicedItems., true);
                embeds.push(embed);

                i = i1;
                i1 = i1 + itemsPerPage;
            }
        }
        // Build pagination
        const Pagination = new PaginationEmbed().setArray(embeds);

        return Pagination;
    }
}