import { CommandWithOptions, type SlashCommandSubcommandBuilder } from '#builders';
import { ApplicationCommandOptionType, SlashCommandBuilder as UnlocalizedBuilder } from 'discord.js';

export class SlashCommandBuilder extends CommandWithOptions<UnlocalizedBuilder> {
    constructor() {
        super(false, ApplicationCommandOptionType.Subcommand);
        this.builder = new UnlocalizedBuilder();
    }

    setDescription(desc: string) {
        this.builder.setDescription(this.getDefault(desc));
        this.builder.setDescriptionLocalizations(this.getLocalizations(desc));
        return this;
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
}
