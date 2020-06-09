import { readJson } from '../directory';

const data = readJson('./data.json');

export interface BotConfig {
    command?: {
        symbol: string;
    },
    discord: {
        log?: boolean;
    }
}

export const DefaultConfig: BotConfig = data;