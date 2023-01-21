import 'dotenv/config';
import { createEnv } from 'neon-env';

export const env = createEnv({
    // authentication
    DISCORD_TOKEN: { type: 'string' },
    DISCORD_SECRET: { type: 'string' },
    DISCORD_CLIENT_ID: { type: 'string' },
    DISCORD_REDIRECT: { type: 'string' },
    JWT_SECRET: { type: 'string' },
    DASHBOARD_URI: { type: 'string' },

    // bot
    DISCORD_DEV_GUILD: { type: 'string' },
    DISCORD_SUPPORT_INVITE: { type: 'string' },
    DISCORD_DEV_IDS: { type: 'array' },

    // other
    NODE_ENV: { type: 'string', default: 'development', choices: ['development', 'production'] as const },
    HYPIXEL_TOKEN: { type: 'string' },
    DATABASE_URL: { type: 'string' },

    // injected
    npm_package_version: { type: 'string' }
});
