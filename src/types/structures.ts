import type { FluorineClient } from '#classes';
import type {
    ChatInputCommandInteraction,
    Collection,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    TextInputComponent,
    Interaction
} from 'discord.js';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

export interface NonCommandInteractionData {
    exists: boolean;
    name: string;
}

export type ComponentData = {
    exists: boolean;
    name: string;
    authorOnly: boolean;
};

export interface BaseCommand {
    onInteraction(client: FluorineClient, interaction: Interaction, value?: string): Promise<void>;
    onCommand(client: FluorineClient, interaction: CommandInteraction): Promise<void>;
    onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction): Promise<void>;
    onContextMenuCommand(client: FluorineClient, interaction: ContextMenuCommandInteraction): Promise<void>;
    onComponent(client: FluorineClient, interaction: MessageComponentInteraction, value?: string): Promise<void>;
    onModal: (
        client: FluorineClient,
        interaction: ModalSubmitInteraction,
        fields: Collection<string, TextInputComponent>
    ) => Promise<void>;

    dev?: boolean;

    slashCommandData: SlashCommandBuilder | SlashCommandSubcommandBuilder;
    contextMenuCommandData: ContextMenuCommandBuilder;

    category: Category;
    cooldown?: number;

    componentData: ComponentData;
    modalData: NonCommandInteractionData;
}

export type Command = Partial<BaseCommand>;
export type ChatInputCommand = Pick<BaseCommand, 'slashCommandData' | 'category'> & Command;
export type ChatInputSubcommand = Pick<BaseCommand, 'slashCommandData'> & Omit<Command, 'dev' | 'category'>;
export type ContextMenuCommand = Pick<BaseCommand, 'contextMenuCommandData'> & Command;
export type Component = Pick<BaseCommand, 'componentData'> & Command;
export type Modal = Pick<BaseCommand, 'modalData'> & Command;

// export interface ChatInputCommand {
//     run: (client: FluorineClient, interaction: CommandInteraction) => void;
//     data: SlashCommandBuilder;
//     category: Category;
//     dev?: boolean;
//     cooldown?: number;
// }

// export interface ChatInputSubcommand {
//     run: (client: FluorineClient, interaction: CommandInteraction) => void;
//     data: SlashCommandSubcommandBuilder;
//     cooldown?: number;
// }

// export interface ContextMenuCommand {
//     run: (client: FluorineClient, interaction: ContextMenuCommandInteraction) => void;
//     data: ContextMenuCommandBuilder;
//     dev?: boolean;
//     cooldown?: number;
// }

// export interface Component {
//     authorOnly: boolean;
//     run: (client: FluorineClient, interaction: MessageComponentInteraction, value: string) => void;
// }

// export interface Modal {
//     run: (
//         client: FluorineClient,
//         interaction: ModalSubmitInteraction,
//         fields: Collection<string, TextInputComponent>,
//         value: string
//     ) => void;
// }

export interface Event {
    run: (client: FluorineClient, ...args: any) => void;
}

export interface PhishingLink {
    url: string;
}

export interface ShopItemConstructor {
    guildId: bigint;
    name: string;
    description: string;
    price: number;
    role?: bigint;
}
