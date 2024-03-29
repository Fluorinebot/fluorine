import type { BuilderResolvable } from '#types';
import type { LocalizationMap } from 'discord.js';
import i18next from 'i18next';

export class BaseBuilder<T extends BuilderResolvable> {
    protected i18n = i18next;
    protected langs = (i18next.options.preload as string[]).filter(lang => lang !== 'en-US');
    protected defaultNS: 'commands' | 'responses';

    public builder: T;

    constructor(ns: 'commands' | 'responses') {
        this.defaultNS = ns;
    }

    getLocalizations(key: string) {
        const localized: LocalizationMap = {};

        for (const lng of this.langs) {
            localized[lng] = this.i18n.t(key, { lng, ns: this.defaultNS });
        }

        return localized;
    }

    getDefault(key: string) {
        return this.i18n.t(key, { lng: 'en-US', ns: this.defaultNS });
    }

    getOne(key: string, lng: keyof LocalizationMap, args: Record<string, any> = {}) {
        return this.i18n.t(key, { lng, ns: this.defaultNS, ...args });
    }
}
