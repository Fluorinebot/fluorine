import type FluorineClient from '#classes/Client';
import { type UserContextMenuInteraction } from 'tiscord';
import hash from 'murmurhash-v3';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction): Promise<void> {
    const user = interaction.target;
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
