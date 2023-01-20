import { CommandWithOptions } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandSubcommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandBuilder extends CommandWithOptions<UnlocalizedBuilder> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Subcommand, baseKey);
        this.builder = new UnlocalizedBuilder();
    }
}
