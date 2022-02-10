import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import clean from '@util/clean';
import { execSync } from 'child_process';
import { Message } from 'discord.js';
export async function run(client: FluorineClient, message: Message, args: string[]) {
    if (!client.devs.includes(message.author.id)) {
        return message.reply(
            client.i18n.t('EVAL_USER_NOT_DEV', {
                lng: message.guild.preferredLocale
            })
        );
    }
    if (args.includes('client.token')) return message.reply('you wish');
    let codex: any = args.join(' ').replaceAll('```js', '').replaceAll('```ts', '');
    if (codex.includes('```sh')) {
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
