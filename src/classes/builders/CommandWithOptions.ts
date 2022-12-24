import { BaseBuilder } from '#builders';
import type {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder
} from 'discord.js';
import {
    AttachmentOption,
    BooleanOption,
    ChannelOption,
    IntegerOption,
    MentionableOption,
    NumberOption,
    RoleOption,
    StringOption,
    UserOption
} from '#options';

export class CommandWithOptions<T extends SlashCommandBuilder | SlashCommandSubcommandBuilder> extends BaseBuilder<T> {
    constructor(isCommand: boolean, type: ApplicationCommandType | ApplicationCommandOptionType) {
        super(isCommand, type);
    }

    addAttachmentOption(input: (option: AttachmentOption) => AttachmentOption) {
        this.builder.addAttachmentOption(input(new AttachmentOption()).builder);
        return this;
    }

    addBooleanOption(input: (option: BooleanOption) => BooleanOption) {
        this.builder.addBooleanOption(input(new BooleanOption()).builder);
        return this;
    }

    addChannelOption(input: (option: ChannelOption) => ChannelOption) {
        this.builder.addChannelOption(input(new ChannelOption()).builder);
        return this;
    }

    addIntegerOption(input: (option: IntegerOption) => IntegerOption) {
        this.builder.addIntegerOption(input(new IntegerOption()).builder);
        return this;
    }

    addMentionableOption(input: (option: MentionableOption) => MentionableOption) {
        this.builder.addMentionableOption(input(new MentionableOption()).builder);
        return this;
    }

    addNumberOption(input: (option: NumberOption) => NumberOption) {
        this.builder.addNumberOption(input(new NumberOption()).builder);
        return this;
    }

    addRoleOption(input: (option: RoleOption) => RoleOption) {
        this.builder.addRoleOption(input(new RoleOption()).builder);
        return this;
    }

    addStringption(input: (option: StringOption) => StringOption) {
        this.builder.addStringOption(input(new StringOption()).builder);
        return this;
    }

    addUserOption(input: (option: UserOption) => UserOption) {
        this.builder.addUserOption(input(new UserOption()).builder);
        return this;
    }
}
