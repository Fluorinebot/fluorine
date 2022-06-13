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

export interface Cooldown {
    user_id: bigint;
    name: string;
    timestamp: bigint;
}

export interface Profile {
    userId: bigint;
    description?: string;
    pronouns?: 'she/her' | 'they/them' | 'he/him';
    website?: string;
    location?: string;
    birthday?: string;
}
