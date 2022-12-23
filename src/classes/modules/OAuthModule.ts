import type { FluorineClient } from '#classes';
import type { APIGuild, APIUser, RESTPostOAuth2ClientCredentialsResult } from 'discord.js';
import { createSigner, createVerifier } from 'fast-jwt';
import { env } from '#env';

export class OAuthModule {
    client: FluorineClient;
    sign = createSigner({ key: env.JWT_SECRET });
    verify = createVerifier({ key: env.JWT_SECRET });

    constructor(client: FluorineClient) {
        this.client = client;
    }
    refreshToken(token: string) {
        return this.client.rest.post(`/oauth2/token`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: env.DISCORD_CLIENT_ID,
                client_secret: env.DISCORD_SECRET,
                grant_type: 'refresh_token',
                refresh_token: token,
                scope: 'identify guilds',
                redirect_uri: env.DISCORD_REDIRECT
            }).toString(),
            auth: false,
            passThroughBody: true
        }) as Promise<RESTPostOAuth2ClientCredentialsResult>;
    }
    getToken(code: string) {
        return this.client.rest.post(`/oauth2/token`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: env.DISCORD_CLIENT_ID,
                client_secret: env.DISCORD_SECRET,
                grant_type: 'authorization_code',
                code,
                scope: 'identify guilds',
                redirect_uri: env.DISCORD_REDIRECT
            }).toString(),
            auth: false,
            passThroughBody: true
        }) as Promise<RESTPostOAuth2ClientCredentialsResult>;
    }

    getGuilds(token: string) {
        return this.client.rest.get('/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            auth: false
        }) as Promise<(APIGuild & { fluorine?: boolean })[]>;
    }

    getUser(token: string) {
        return this.client.rest.get('/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            auth: false
        }) as Promise<APIUser>;
    }
}
