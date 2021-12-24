import { MessageEmbed } from 'discord.js';
import LanguageHandler from './handlers/LanguageHandler';
import { LanguageStrings } from 'types/language.type';

export interface LocaleFieldOptions {
    name: LanguageStrings;
    value?: string;
    localeValue?: LanguageStrings;
    inline?: boolean;
    args?: Record<string, unknown>;
    valueArgs?: Record<string, unknown>;
}

export default class Embed extends MessageEmbed {
    language: LanguageHandler;
    locale?: string;
    constructor(locale?: string) {
        super({});
        this.setColor('#3872f2');
        this.setTimestamp();
        this.language = new LanguageHandler();
        this.locale = locale;
    }

    public setLocaleTitle(title: LanguageStrings, args = {}): this {
        return super.setTitle(
            this.language.get(this.locale, title, args).toString()
        );
    }

    public setLocaleDescription(description: LanguageStrings, args = {}): this {
        return super.setDescription(
            this.language.get(this.locale, description, args).toString()
        );
    }

    public addLocaleField(field: LocaleFieldOptions): this {
        return super.addField(
            this.language.get(this.locale, field.name, field.args).toString(),
            field.localeValue
                ? this.language
                      .get(this.locale, field.localeValue, field.valueArgs)
                      .toString()
                : field.value,
            field.inline
        );
    }
}
