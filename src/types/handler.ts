import FluorineClient from '@classes/Client';
export interface Handler {
    setup(client: FluorineClient): void;
}
