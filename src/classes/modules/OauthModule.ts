import type { FluorineClient } from '#classes';
import process from 'node:process';
export class OauthModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    getToken(code: string) {
        return this.client.rest.post(`/oauth2/token`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_SECRET,
                grant_type: 'authorization_code',
                code,
                scope: 'identify guilds',
                redirect_uri: process.env.DISCORD_REDIRECT
            }).toString(),
            auth: false,
            passThroughBody: true
        });
    }
    getGuilds(token: string) {
        return this.client.rest.get('/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            auth: false
        });
    }
    getUser(token: string) {
        return this.client.rest.get('/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            auth: false
        });
    }
}
