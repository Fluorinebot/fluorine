export interface Config {
    guildId: bigint;
    prefix: string;
    logsEnabled: boolean;
    logsChannel?: bigint;
    logModerationActions?: boolean;
    antibotEnabled: boolean;
    antibotAction?: 'ban' | 'kick' | 'timeout' | 'warn';
}

export interface Case {
    guildId: bigint;
    caseId: number;
    caseCreator: bigint;
    moderatedUser: bigint;
    type: 'ban' | 'kick' | 'timeout' | 'warn';
    reason: string;
}

export interface Cooldown {
    userId: bigint;
    name: string;
    lastUsedAt: Date;
}

export interface BankAccount {
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
