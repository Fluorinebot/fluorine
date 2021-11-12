import { ConnectionOptions } from "rethinkdb";

export interface ConfigType {
	token: string;
	prefix: string;
	rethink: ConnectionOptions;
	hypixel: string;
	statcord: string;
	aiurl: string;
	aitoken: string;
}
