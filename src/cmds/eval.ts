import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import clean from '@util/clean';

export async function run(
    client: FluorineClient,
    message: Message,
    args: string[]
) {
    if (
        message.author.id !== '707675871355600967' &&
        message.author.id !== '478823932913516544'
    ) {
        return message.reply('ta komenda jest dostepna tylko dla developerow');
    }
    if (args.includes('client.token'))
        return message.reply('usun client.token ');
    let codex = args.join(' ').replaceAll('```js', '').replaceAll('```ts', '');

    if (codex.indexOf('```', codex.length - 4) !== -1) {
        codex = codex.slice(0, -3);
    }
    const code = codex.replace('client.token', '"no"');
    try {
        const evaled = eval(code);
        const cleant = await clean(client, evaled);

        const embed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Wykonano!')
            .setDescription(`\`\`\`js\n${cleant}\n\`\`\``);
        message.reply({ embeds: [embed] });
        message.react('✅');
    } catch (err) {
        const errorEmbed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Error')
            .setDescription(`\`\`\`xl\n${await clean(client, err)}\n\`\`\``)
            .setFooter(client.footer);
        message.reply({ embeds: [errorEmbed] });
        message.react('❌');
    }
}

export const help = {
    name: 'eval',
    description: 'Ewaluuj kod js',
    aliases: ['wykonaj'],
    category: 'dev'
};
