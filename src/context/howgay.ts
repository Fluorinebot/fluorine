import type FluorineClient from '#classes/Client';
import { ApplicationCommandType, ContextMenuCommandBuilder, type UserContextMenuCommandInteraction } from 'discord.js';
import hash from 'murmurhash-v3';

export async function run(
    client: FluorineClient,
    interaction: UserContextMenuCommandInteraction<'cached'>
): Promise<void> {
    const user = interaction.targetUser;
    const percent = ['478823932913516544', '348591272476540928'].includes(user.id) ? 100 : hash(user.toString()) % 101;

    interaction.reply(
        client.i18n.t('HOWGAY', {
            lng: interaction.locale,
            percent,
            thing: user.toString()
        })
    );
}

export const data = new ContextMenuCommandBuilder()
    .setName('How Gay')
    .setNameLocalizations({ pl: 'How Gay' })
    .setType(ApplicationCommandType.User);
