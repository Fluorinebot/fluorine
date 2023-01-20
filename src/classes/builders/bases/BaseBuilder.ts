import type { BuilderResolvable } from '#types';
import type { LocalizationMap } from 'discord.js';
import i18next from 'i18next';

const preload = i18next.options.preload as string[];

export class BaseBuilder<T extends BuilderResolvable> {
    protected i18n = i18next;
    protected langs = preload.filter(lang => lang !== 'en-US');

    public builder: T;

    getLocalizations(key: string) {
        const localized: LocalizationMap = {};

        for (const lang of this.langs) {
            localized[lang] = this.i18n.t(key, { lng: lang, ns: 'commands' });
        }

        return localized;
    }

    getDefault(key: string) {
        return this.i18n.t(key, { lng: 'en-US', ns: 'commands' });
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
