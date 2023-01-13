import { BaseCommand, type SlashCommandSubcommandBuilder } from '#builders';
import { ApplicationCommandOptionType, SlashCommandSubcommandGroupBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandSubcommandGroupBuilder extends BaseCommand<UnlocalizedBuilder> {
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
