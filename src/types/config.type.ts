import { ConnectionOptions } from 'rethinkdb';

export interface ConfigType {
    token: string;
    prefix: string;
    rethink: ConnectionOptions;
    hypixel: string;
    statcord: string;
    aiurl: string;
    secret: string;
    redirect_uri: string;
    domain: string;
    cors: string;
    aiurls: string[];
    aitoken: string;
}
