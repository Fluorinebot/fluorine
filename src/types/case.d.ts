export interface Case {
    id: number;
    guild: string;
    user: string;
    creator: string;
    type: string;
    dscp: string;
}

export enum CaseType {
    ban = 'Ban',
    kick = 'Wyrzucenie',
    warn = 'Warn',
    mute = 'Wyciszenie'
}
