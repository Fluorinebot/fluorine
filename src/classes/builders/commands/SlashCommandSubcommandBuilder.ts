import { CommandBuilderWithOptions } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandSubcommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandBuilder extends CommandBuilderWithOptions<UnlocalizedBuilder> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Subcommand, baseKey);
        this.builder = new UnlocalizedBuilder();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
