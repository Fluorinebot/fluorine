import { CommandWithOptions } from '#builders';
import { ApplicationCommandOptionType, SlashCommandSubcommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandBuilder extends CommandWithOptions<UnlocalizedBuilder> {
    constructor() {
        super(false, ApplicationCommandOptionType.Subcommand);
        this.builder = new UnlocalizedBuilder();
    }

    setDescription(desc: string) {
        this.builder.setDescription(this.getDefault(desc));
        this.builder.setDescriptionLocalizations(this.getLocalizations(desc));
        return this;
    }
}
