import 'dotenv/config';
import { createEnv } from 'neon-env';

export const env = createEnv({
    // authentication-related constants
    DISCORD_TOKEN: { type: 'string' },
    DISCORD_SECRET: { type: 'string' },
    DISCORD_CLIENT_ID: { type: 'string' },
    DISCORD_REDIRECT: { type: 'string', parser: url => new URL(url) },
    JWT_SECRET: { type: 'string' },

    // bot config
    DISCORD_DEV_GUILD: { type: 'string', parser: url => new URL(url) },
    DISCORD_SUPPORT_INVITE: { type: 'string', parser: url => new URL(url) },
    DISCORD_DEV_IDS: { type: 'array' },

    // other constants
    HYPIXEL_TOKEN: { type: 'string' },
    DATABASE_URL: { type: 'string' }
});
