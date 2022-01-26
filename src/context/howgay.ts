import FluorineClient from '@classes/Client';
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandType } from 'discord-api-types';
import { UserContextMenuInteraction } from 'discord.js';
import hash from 'murmurhash-v3';

export async function run(
    client: FluorineClient,
    interaction: UserContextMenuInteraction
): Promise<void> {
    const thing = interaction.targetMember;

    const percent =
        `${thing}` === '<@478823932913516544>' ? 100 : hash(`${thing}`) % 101;

    interaction.reply(
        client.language.get(interaction.locale, 'HOWGAY', {
            percent,
            thing
        })
    );
}

export const data = new ContextMenuCommandBuilder()
    .setName('How Gay')
    .setType(ApplicationCommandType.User);

export const dev = true;
