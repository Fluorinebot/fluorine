import FluorineClient from '@classes/Client';

export interface Event {
    run: (client: FluorineClient, ...args) => void;
}
