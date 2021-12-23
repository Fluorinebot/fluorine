import FluorineClient from '@classes/Client';
import { Message } from 'discord.js';
import { exec } from 'child_process';

export async function run(client: FluorineClient, message: Message) {
    if (message.author.id !== '707675871355600967' && message.author.id !== '478823932913516544') {
        return message.reply('ta komenda jest dostepna tylko dla developerów.');
    }
    exec('git pull', () => {
        exec('npm run build', () => {
            exec('npm i', () => {
                message.reply('pomyślnie zaktualizowano');
            });
        });
    });
}
export const help = {
    name: 'update',
    description: 'Aktualizuj bota',
    aliases: ['aktualizuj'],
    category: 'dev'
};
