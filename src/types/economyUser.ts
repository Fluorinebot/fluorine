export interface EconomyUser {
    id: string;
    guild: string;
    balance: {
        wallet: number;
        bank: number;
    };
    cooldown?: {
        work?: number;
        crime?: number;
    };
}
