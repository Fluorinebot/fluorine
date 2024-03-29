import 'dotenv/config';
import { createEnv } from 'neon-env';

export const env = createEnv({
    // authentication
    DISCORD_TOKEN: { type: 'string' },
    DISCORD_SECRET: { type: 'string' },
    DISCORD_REDIRECT: { type: 'string' },
    DASHBOARD_URI: { type: 'string' },
    JWT_SECRET: { type: 'string' },

    // bot
    DISCORD_DEV_IDS: { type: 'array' },
    DISCORD_DEV_GUILD: { type: 'string' },
    DISCORD_SUPPORT_INVITE: { type: 'string' },

    // other
    NODE_ENV: { type: 'string', default: 'development', choices: ['development', 'production'] },
    HYPIXEL_TOKEN: { type: 'string' },
    DATABASE_URL: { type: 'string' },

    // injected
    npm_package_version: { type: 'string' }
});
