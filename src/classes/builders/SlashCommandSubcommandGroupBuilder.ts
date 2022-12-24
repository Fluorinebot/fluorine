import { BaseBuilder, type SlashCommandSubcommandBuilder } from '#builders';
import { ApplicationCommandOptionType, SlashCommandSubcommandGroupBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandGroupBuilder extends BaseBuilder<UnlocalizedBuilder> {
    constructor() {
        super(false, ApplicationCommandOptionType.Subcommand);
        this.builder = new UnlocalizedBuilder();
    }

    setDescription(desc: string) {
        this.builder.setDescription(this.getDefault(desc));
        this.builder.setDescriptionLocalizations(this.getLocalizations(desc));
        return this;
    }

    addSubcommand(subcommand: SlashCommandSubcommandBuilder) {
        this.builder.addSubcommand(subcommand.builder);
        return this;
    }
}
