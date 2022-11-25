import { type FluorineClient, Embed } from '#classes';
import { clean } from '#util';
import { codeBlock, type Collection, type ModalSubmitInteraction, type TextInputComponent } from 'discord.js';

export async function run(
    client: FluorineClient,
    interaction: ModalSubmitInteraction,
    fields: Collection<string, TextInputComponent>
) {
    const code = fields.get('code').value;
    code.replace('```js\n', '').replace('\n```', '');
    const embed = new Embed(client, interaction.locale);

    try {
        const evaluated = eval(code);
        const cleaned = await clean(client, evaluated);

        embed.setTitle('Done').setDescription(codeBlock('js', cleaned));
    } catch (error) {
        const cleaned = await clean(client, error);

        embed.setTitle('Failed').setDescription(codeBlock('js', cleaned));
    }

    interaction.reply({ embeds: [embed] });
}
