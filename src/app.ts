import { DefaultConfig, Bot, logger } from './resources';

const bot = new Bot(DefaultConfig);

bot.connect().then(() => {
    logger.debug('Bot connected!');
    console.log('Bot connected!');
}).catch(err => logger.error(err));