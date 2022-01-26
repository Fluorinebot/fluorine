export interface EconomyUser {
    id: string;
    guild: string;
    balance: {
        wallet: number;
        bank: number;
    };
}
