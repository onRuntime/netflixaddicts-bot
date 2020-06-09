import { CommandMap } from './command-map';
import { BotConfig } from "./config";
import { Client } from "discord.js";

export interface IBot {
    config: BotConfig;
    client: Client;
    commands: CommandMap;
    online: boolean;
    plugins: IBotPlugin[];

    connect(): Promise<string>;

    stop();
}

export interface IBotPlugin {
    initialize?(bot: IBot): void;
    enable?(bot: IBot): void;
    disable?(bot: IBot): void;
}