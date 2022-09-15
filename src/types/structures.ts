import type { FluorineClient } from '#classes';
import type {
    Collection,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    TextInputComponent
} from 'discord.js';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

export interface ChatInputCommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandBuilder;
    category: Category;
    dev?: boolean;
    cooldown?: number;
}

export interface ChatInputSubcommand {
    run: (client: FluorineClient, interaction: CommandInteraction) => void;
    data: SlashCommandSubcommandBuilder;
    cooldown?: number;
}

export interface ContextMenuCommand {
    run: (client: FluorineClient, interaction: ContextMenuCommandInteraction) => void;
    data: ContextMenuCommandBuilder;
    dev?: boolean;
    cooldown?: number;
}

export interface Component {
    authorOnly: boolean;
    run: (client: FluorineClient, interaction: MessageComponentInteraction, value: string) => void;
}

export interface Modal {
    run: (
        client: FluorineClient,
        interaction: ModalSubmitInteraction,
        fields: Collection<string, TextInputComponent>
    ) => void;
}
export interface Event {
    run: (client: FluorineClient, ...args: any) => void;
}

export interface PhishingLink {
    url: string;
}

export interface AIQueue {
    interaction: CommandInteraction | ContextMenuCommandInteraction;
    text: string;
}

export interface ShopItemConstructor {
    guildId: bigint;
    name: string;
    description: string;
    price: number;
    role?: bigint;
}
