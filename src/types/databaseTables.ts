export type caseAction = 'ban' | 'kick' | 'timeout' | 'warn';

export interface Config {
    guildId: bigint;
    prefix: string;
    logs_enabled: boolean;
    logs_channel?: bigint;
    log_moderation_actions?: boolean;
    antibot_factor: number;
    antibot_action?: caseAction;
    currency: string;
}

export interface Case {
    guild_id: bigint;
    case_id: number;
    case_creator: bigint;
    moderated_user: bigint;
    type: caseAction;
    reason: string;
}

export interface Cooldown {
    userId: bigint;
    name: string;
    lastUsedAt: Date;
}

export interface Economy {
    guildId: bigint;
    userId: bigint;
    walletBal: number;
    bankBal: number;
}

export interface ShopItem {
    guildId: bigint;
    itemId: number;
    name: string;
    description: string;
    price: number;
    role?: bigint;
}

export interface Profile {
    userId: bigint;
    description?: string;
    pronouns?: 'she/her' | 'they/them' | 'he/him';
    website?: string;
    location?: string;
    birthday?: string;
}
