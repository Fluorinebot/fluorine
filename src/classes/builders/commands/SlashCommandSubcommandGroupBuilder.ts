import { BaseCommandBuilder } from '#builderBases';
import type { SlashCommandSubcommandBuilder } from '#commands';
import { ApplicationCommandOptionType, SlashCommandSubcommandGroupBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandGroupBuilder extends BaseCommandBuilder<UnlocalizedBuilder> {
    public subcommandQueue: SlashCommandSubcommandBuilder[];
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.SubcommandGroup, baseKey);
        this.builder = new UnlocalizedBuilder();
        this.subcommandQueue = [];
    }

    addSubcommand(subcommand: SlashCommandSubcommandBuilder) {
        this.subcommandQueue.push(subcommand);
        return this;
    }
}
