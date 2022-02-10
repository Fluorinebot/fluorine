import FluorineClient from '@classes/Client';
import { execSync } from 'child_process';
import { Message } from 'discord.js';

export async function run(client: FluorineClient, message: Message) {
    if (message.author.id !== '707675871355600967' && message.author.id !== '478823932913516544') {
        return message.reply('ta komenda jest dostepna tylko dla developerów.');
    }
    execSync('git pull');
    execSync('npm run build');
    execSync('npm i');
    message.reply('pomyślnie zaktualizowano');
}
