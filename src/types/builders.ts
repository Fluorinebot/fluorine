import type {
    ActionRowBuilder,
    ButtonBuilder,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    ModalBuilder,
    SelectMenuBuilder,
    SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandMentionableOption,
    SlashCommandNumberOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption,
    TextInputBuilder
} from 'discord.js';

export type CommandResolvable =
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | ContextMenuCommandBuilder
    | SlashCommandSubcommandGroupBuilder;

export type OptionResolvable =
    | SlashCommandAttachmentOption
    | SlashCommandBooleanOption
    | SlashCommandChannelOption
    | SlashCommandIntegerOption
    | SlashCommandMentionableOption
    | SlashCommandNumberOption
    | SlashCommandRoleOption
    | SlashCommandStringOption
    | SlashCommandUserOption;

export type ComponentResolvable =
    | ActionRowBuilder
    | ButtonBuilder
    | ModalBuilder
    | TextInputBuilder
    | SelectMenuBuilder;

export type ApplicationCommandBuilderResolvable = CommandResolvable | OptionResolvable;
export type BuilderResolvable = ApplicationCommandBuilderResolvable | ComponentResolvable | EmbedBuilder;

export interface LocaleFieldOptions {
    name?: string;
    nameArgs?: Record<string, unknown>;
    value?: string;
    valueArgs?: Record<string, unknown>;
    rawName?: string;
    rawValue?: string;
    inline?: boolean;
}

export interface LocaleAuthor {
    name?: string;
    nameArgs?: Record<string, unknown>;
    rawName?: string;
    url?: string;
    iconURL?: string;
}

export interface LocaleFooter {
    text?: string;
    textArgs?: Record<string, unknown>;
    rawText?: string;
    iconURL?: string;
}
