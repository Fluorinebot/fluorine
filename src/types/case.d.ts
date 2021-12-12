export interface Case {
    id: number;
    guild: string;
    user: string;
    creator: string;
    type: string;
    dscp: string;
}

export declare enum CaseType {
    ban = 'Ban',
    kick = 'Wyrzucenie',
    warn = 'Warn',
    mute = 'Wyciszenie'
}
