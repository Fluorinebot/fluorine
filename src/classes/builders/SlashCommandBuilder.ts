import {
    CommandWithOptions,
    type SlashCommandSubcommandBuilder,
    type SlashCommandSubcommandGroupBuilder
} from '#builders';
import { ApplicationCommandOptionType, SlashCommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandBuilder extends CommandWithOptions<UnlocalizedBuilder> {
    constructor() {
        super(false, ApplicationCommandOptionType.Subcommand);
        this.builder = new UnlocalizedBuilder();
    }

    setDefaultMemberPermissions(permissions: bigint | string | number) {
        this.builder.setDefaultMemberPermissions(permissions);
        return this;
    }

    setDMPermission(permission: boolean) {
        this.builder.setDMPermission(permission);
        return this;
    }

    addSubcommand(subcommand: SlashCommandSubcommandBuilder) {
        this.builder.addSubcommand(subcommand.builder);
        return this;
    }

    addSubcommandGroup(subCommandGroup: SlashCommandSubcommandGroupBuilder) {
        this.builder.addSubcommandGroup(subCommandGroup.builder);
        return this;
    }
}
