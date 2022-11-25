import { type FluorineClient, Embed } from '#classes';
import { clean } from '#util';
import { execSync } from 'node:child_process';
import { codeBlock, type Collection, type ModalSubmitInteraction, type TextInputComponent } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>
) {
    const code = fields.get('code').value;
    code.replace('```sh\n', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = execSync(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('sh', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('sh', cleaned));
    }

    interaction.reply({ embeds: [embed] });
}
