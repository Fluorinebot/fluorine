import { ConnectionOptions } from 'rethinkdb';

export interface ConfigType {
    token: string;
    prefix: string;
    rethink: ConnectionOptions;
    hypixel: string;
    statcord: string;
    secret: string;
    redirect_uri: string;
    domain: string;
    cors: string;
    aiurl: string;
    aitoken: string;
}
