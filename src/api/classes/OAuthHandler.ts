/* eslint-disable camelcase */
import FluorineClient from '@classes/Client';
import { fetch } from 'undici';
export default class OAuthHandler {
    scopes: string[];
    client: FluorineClient;
    constructor(client: FluorineClient, scopes: string[]) {
        this.scopes = scopes;
        this.client = client;
    }
    async getToken(code: string) {
        const returned: any = await (
            await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: this.client.user.id,
                    client_secret: this.client.config.secret,
                    grant_type: 'authorization_code',
                    code,
                    scope: this.scopes.join(),
                    redirect_uri: this.client.config.redirect_uri
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        ).json();
        // @ts-ignore
        return returned;
    }
    async getUser(token: string) {
        const returned: any = await (
            await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ).json();
        return returned;

            .catch(() => {
                // h
            });
        // @ts-ignore
        return returned?.data || null;
    }
    async getGuilds(token: string) {
        const returned: any = await (
            await fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ).json();
        return returned;
    }
    async refreshToken(refresh_token: string) {
        const returned: any = await (
            await fetch('https://discord.com/api/oauth2/token', {
                body: new URLSearchParams({
                    client_id: this.client.user.id,
                    client_secret: this.client.config.secret,
                    grant_type: 'refresh_token',
                    refresh_token
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        ).json();
        // @ts-ignore
        return returned?.data;
    }
}
