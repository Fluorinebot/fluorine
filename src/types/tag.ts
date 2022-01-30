export interface Tag {
    id: string;
    name: string;
    content: string;
    ephemeral: boolean;
    creator: string;
    date: Date;
    uses: number;
}
