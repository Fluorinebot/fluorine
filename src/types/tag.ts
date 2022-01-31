export interface Tag {
    id: string;
    name: string;
    content: string;
    ephemeral: boolean;
    user: string;
    date: Date;
    uses: number;
}
