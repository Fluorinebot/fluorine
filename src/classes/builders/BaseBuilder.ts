import type { BuilderResolvable } from '#types';
import type { ApplicationCommandType, ApplicationCommandOptionType, LocalizationMap } from 'discord.js';
import i18next from 'i18next';

const preload = i18next.options.preload as string[];

export class BaseBuilder<T extends BuilderResolvable> {
    builder: T;
    private i18n = i18next;
    private langs = preload.filter(lang => lang !== 'en-US');

    constructor(public isCommand: boolean, public type: ApplicationCommandType | ApplicationCommandOptionType) {
        this.isCommand = isCommand;
        this.type = type;
    }

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

    setName(name: string) {
        this.builder.setName(this.getDefault(name));
        this.builder.setNameLocalizations(this.getLocalizations(name));
        return this;
    }

    toJSON() {
        this.builder.toJSON();
    }
}
