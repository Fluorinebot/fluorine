import { MessageEmbed } from 'discord.js';
import Client from '@classes/Client';
import i18next from 'i18next';

export interface LocaleFieldOptions {
    name: string;
    value?: string;
    localeValue?: string;
    inline?: boolean;
    args?: Record<string, unknown>;
    valueArgs?: Record<string, unknown>;
}

export default class Embed extends MessageEmbed {
    i18n: typeof i18next;
    locale: string;
    constructor(client: Client, locale: string) {
        super({});
        this.setColor('#3872f2');
        this.setFooter({
            text: client.footer,
            iconURL: client.user.avatarURL()
        });
        this.setTimestamp();
        this.i18n = client.i18n;
        this.locale = locale;
    }

    public setLocaleTitle(title: string, args = {}): this {
        return super.setTitle(
            this.i18n.t(title, { lng: this.locale, ...args })
        );
    }

    public setLocaleDescription(description: string, args = {}): this {
        return super.setDescription(
            this.i18n.t(description, { lng: this.locale, ...args })
        );
    }

    public addLocaleField(field: LocaleFieldOptions): this {
        return super.addField(
            this.i18n.t(field.name, { lng: this.locale, ...field.args }),
            field.value ||
                this.i18n.t(field.localeValue, {
                    lng: this.locale,
                    ...field.valueArgs
                }),
            field.inline
        );
    }
}
