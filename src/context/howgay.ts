import FluorineClient from '@classes/Client';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { UserContextMenuInteraction } from 'discord.js';
import hash from 'murmurhash-v3';

export async function run(client: FluorineClient, interaction: UserContextMenuInteraction<'cached'>): Promise<void> {
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
