import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Message } from 'discord.js';
import clean from '@util/clean';
import { execSync } from 'child_process';
import { transpile, transpileModule } from 'typescript';
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
    if (args.includes('client.token')) return message.reply('you wish');
    let codex: any = args.join(' ').replaceAll('```js', '');
    if (codex.indexOf('```ts') !== -1) {
        codex = codex.replaceAll('```ts', '').replaceAll('```', '');
        codex = transpileModule(codex, {});
        console.log(codex);
        try {
            const evaled = eval(codex);
            const cleant = await clean(client, evaled);
            const embed = new Embed(client, message.guild.preferredLocale)
                .setTitle('Done!')
                .setDescription(`\`\`\`js\n${cleant}\n\`\`\``);
            message.reply({ embeds: [embed] });
            return message.react('✅');
        } catch (err) {
            const errorEmbed = new Embed(client, message.guild.preferredLocale)
                .setTitle('Error')
                .setDescription(
                    `\`\`\`xl\n${await clean(client, err)}\n\`\`\``
                );
            message.reply({ embeds: [errorEmbed] });
            return message.react('❌');
        }
    }
    if (codex.indexOf('```sh') !== -1) {
        codex = codex.replaceAll('```sh', '').replaceAll('```', '');
        const output = execSync(codex).toString();
        const embed2 = new Embed(client, message.guild.preferredLocale)
            .setTitle('Done!')
            .setDescription(`\`\`\`sh\n${output}\n\`\`\``);
        return message.reply({ embeds: [embed2] });
    }
    if (codex.indexOf('```', codex.length - 4) !== -1) {
        codex = codex.slice(0, -3);
    }
    const code = codex.replaceAll('client.token', '"no"');
    try {
        const evaled = eval(code);
        const cleant = await clean(client, evaled);

        const embed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Done!')
            .setDescription(`\`\`\`js\n${cleant}\n\`\`\``);
        message.reply({ embeds: [embed] });
        message.react('✅');
    } catch (err) {
        const errorEmbed = new Embed(client, message.guild.preferredLocale)
            .setTitle('Error')
            .setDescription(`\`\`\`xl\n${await clean(client, err)}\n\`\`\``);
        message.reply({ embeds: [errorEmbed] });
        message.react('❌');
    }
}

export const help = {
    name: 'dev',
    description: 'run code',
    aliases: ['wykonaj'],
    category: 'dev'
};
