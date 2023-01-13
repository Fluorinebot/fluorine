import {
    CommandWithOptions,
    type SlashCommandSubcommandBuilder,
    type SlashCommandSubcommandGroupBuilder
} from '#builders';
import { ApplicationCommandType, SlashCommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandBuilder extends CommandWithOptions<UnlocalizedBuilder> {
    constructor(baseKey: string) {
        super(ApplicationCommandType.ChatInput, baseKey);
        this.builder = new UnlocalizedBuilder();

        this.setName(baseKey);
        this.setDescription(baseKey);
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
        this.builder.addSubcommand(
            subcommand.setBaseKey(`${this.baseKey}.${subcommand.baseKey}`).prepareOptions().builder
        );
        return this;
    }

    addSubcommandGroup(subcommandGroup: SlashCommandSubcommandGroupBuilder) {
        subcommandGroup.setBaseKey(`${this.baseKey}.${subcommandGroup.baseKey}`);

        for (const subcommand of subcommandGroup.subcommandQueue) {
            subcommand.setBaseKey(`${subcommandGroup.baseKey}.${subcommand.baseKey}`);
            subcommandGroup.builder.addSubcommand(subcommand.prepareOptions().builder);
        }

        this.builder.addSubcommandGroup(subcommandGroup.builder);
        return this;
    }
}
