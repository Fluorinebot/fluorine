import { ColorResolvable, EmbedBuilder } from 'discord.js';
import FluorineClient from '@classes/Client';
import i18next from 'i18next';

export interface LocaleFieldOptions {
    name: string;
    value?: string;
    localeValue?: string;
    inline?: boolean;
    args?: Record<string, unknown>;
    valueArgs?: Record<string, unknown>;
}

export default class Embed extends EmbedBuilder {
    clientColor: ColorResolvable = 0x3872f2;
    private i18n: typeof i18next;

    constructor(client: FluorineClient, private locale: string) {
        super();

        this.setColor(this.clientColor);
        this.setFooter({
            text: `Fluorine ${client.version}`,
            iconURL: client.user.avatarURL()
        });
        this.setTimestamp();

        this.i18n = client.i18n;
        this.locale = locale;
    }

    public setLocaleTitle(title: string, args = {}): this {
        return super.setTitle(this.i18n.t(title, { lng: this.locale, ...args }));
    }

    public setLocaleDescription(description: string, args = {}): this {
        return super.setDescription(this.i18n.t(description, { lng: this.locale, ...args }));
    }

    public addLocaleFields(fields: LocaleFieldOptions[]): this {
        return super.addFields(
            fields.map(field => ({
                name: this.i18n.t(field.name, { lng: this.locale, ...field.args }),
                value:
                    field.value ||
                    this.i18n.t(field.localeValue, {
                        lng: this.locale,
                        ...field.valueArgs
                    }),
                inline: field.inline
            }))
        );
    }
}
