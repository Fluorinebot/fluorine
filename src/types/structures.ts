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
    Interaction as EventInteraction
} from 'discord.js';

export type Category = 'fun' | 'tools' | 'moderation' | 'economy';

/**
 * * This interaction type overtakes the main discord.js interaction type so the discord.js `Interaction` class is to be imported using `Interaction as EventInteraction`
 */
export interface Interaction {
    onInteraction(client: FluorineClient, interaction: EventInteraction, value?: string): Promise<void>;
    onCommand(client: FluorineClient, interaction: CommandInteraction): Promise<void>;
    onSlashCommand(client: FluorineClient, interaction: ChatInputCommandInteraction): Promise<void>;
    onContextMenuCommand(client: FluorineClient, interaction: ContextMenuCommandInteraction): Promise<void>;
    onComponent(client: FluorineClient, interaction: MessageComponentInteraction, value?: string): Promise<void>;
    onModal: (
        client: FluorineClient,
        interaction: ModalSubmitInteraction,
        fields: Collection<string, TextInputComponent>
    ) => Promise<void>;
    slashCommandData: SlashCommandBuilder | SlashCommandSubcommandBuilder;
    contextMenuCommandData: ContextMenuCommandBuilder;
    category: Category;
    cooldown?: number;
    dev?: boolean;
    hasComponent: boolean;
}

export type InteractionPartial = Partial<Interaction>;
export type ChatInputCommand = Pick<Interaction, 'slashCommandData' | 'category' | 'cooldown'> & InteractionPartial;
export type ContextMenuCommand = Pick<Interaction, 'contextMenuCommandData'> & InteractionPartial;

export type Component = Pick<Interaction, 'hasComponent'> & InteractionPartial;

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
