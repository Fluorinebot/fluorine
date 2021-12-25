export interface Case {
    id: number;
    guild: string;
    user: string;
    creator: string;
    type: 'ban' | 'kick' | 'warn' | 'mute';
    dscp: string;
}
