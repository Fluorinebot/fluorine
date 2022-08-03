import type FluorineClient from '#classes/Client';
import type {
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    ContextMenuCommandBuilder
} from '@discordjs/builders';
import type {
    ButtonInteraction,
    CommandInteraction,
    MessageContextMenuInteraction,
    SelectMenuInteraction,
    UserContextMenuInteraction
} from 'tiscord';

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
    run: (client: FluorineClient, interaction: MessageContextMenuInteraction | UserContextMenuInteraction) => void;
    data: ContextMenuCommandBuilder;
    dev?: boolean;
    cooldown?: number;
}

export interface Component {
    authorOnly: boolean;
    run: (client: FluorineClient, interaction: ButtonInteraction | SelectMenuInteraction, value: string) => void;
}

export interface Event {
    run: (client: FluorineClient, ...args: any) => void;
}

export interface PhishingLink {
    url: string;
}

export interface AIQueue {
    interaction: CommandInteraction | MessageContextMenuInteraction | UserContextMenuInteraction;
    text: string;
}

export interface ShopItemConstructor {
    guildId: bigint;
    name: string;
    description: string;
    price: number;
    role?: bigint;
}
