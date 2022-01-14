import { ConnectionOptions } from 'rethinkdb';

export interface ConfigType {
    token: string;
    prefix: string;
    rethink: ConnectionOptions;
    hypixel: string;
    aiurl: string;
    secret: string;
    redirect_uri: string;
    domain: string;
    cors: string;
    safeBrowsing: string;
}
