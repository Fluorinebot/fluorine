import type { BuilderResolvable } from '#types';
import {
    ContextMenuCommandBuilder,
    type ApplicationCommandOptionType,
    type ApplicationCommandType,
    type LocalizationMap
} from 'discord.js';
import i18next from 'i18next';

const preload = i18next.options.preload as string[];

export class BaseBuilder<T extends BuilderResolvable> {
    private i18n = i18next;
    private langs = preload.filter(lang => lang !== 'en-US');

    public builder: T;
    public baseKey: string;
    public type: ApplicationCommandOptionType | ApplicationCommandType;

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
        name = this.builder instanceof ContextMenuCommandBuilder ? `${name}.CONTEXT` : `${name}.NAME`;

        this.builder.setName(this.getDefault(name));
        this.builder.setNameLocalizations(this.getLocalizations(name));
        return this;
    }

    setDescription(description: string) {
        if (this.builder instanceof ContextMenuCommandBuilder) {
            return;
        }

        this.builder.setDescription(this.getDefault(`${description}.DESCRIPTION`));
        this.builder.setDescriptionLocalizations(this.getLocalizations(`${description}.DESCRIPTION`));
        return this;
    }

    toJSON() {
        return this.builder.toJSON();
    }

    setBaseKey(key: string) {
        this.baseKey = key;
        this.setName(this.baseKey);
        this.setDescription(this.baseKey);

        return this;
    }
}
