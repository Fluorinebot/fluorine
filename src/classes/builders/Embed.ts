import { BaseBuilder } from '#builderBases';
import type { FluorineClient } from '#classes';
import type { LocaleFieldOptions, LocaleAuthor, LocaleFooter } from '#types';
import { EmbedBuilder as UnlocalizedBuilder, type ColorResolvable, type LocalizationMap } from 'discord.js';

export class EmbedBuilder extends BaseBuilder<UnlocalizedBuilder> {
    clientColor: ColorResolvable = 0x3872f2;

    constructor(private client: FluorineClient, private locale: keyof LocalizationMap) {
        super('commands');
        this.builder = new UnlocalizedBuilder();
        this.locale = locale;
        this.client = client;

        this.setColor(this.clientColor);
        this.setTimestamp();

        this.setFooter({
            rawText: `Fluorine ${client.version}`,
            iconURL: client.user.avatarURL()
        });
    }

    protected mapField(field: LocaleFieldOptions) {
        return {
            name: field.rawName ?? this.getOne(field.name, this.locale, field.nameArgs),
            value: field.rawValue ?? this.getOne(field.value, this.locale, field.valueArgs),
            inline: field.inline
        };
    }

    addFields(...fields: LocaleFieldOptions[]) {
        this.builder.addFields(fields.map(field => this.mapField(field)));
        return this;
    }

    setAuthor({ name, nameArgs, rawName, url, iconURL }: LocaleAuthor) {
        this.builder.setAuthor({ name: rawName ?? this.getOne(name, this.locale, nameArgs), url, iconURL });
        return this;
    }

    setColor(color: ColorResolvable) {
        this.builder.setColor(color);
        return this;
    }

    setDescription(description: string, args: Record<string, any> = {}): this {
        this.builder.setDescription(args.raw ? description : this.getOne(description, this.locale, args));
        return this;
    }

    setFooter({ text, textArgs, rawText, iconURL }: LocaleFooter) {
        this.builder.setFooter({ text: rawText ?? this.getOne(text, this.locale, textArgs), iconURL });
        return this;
    }

    setImage(url: string) {
        this.builder.setImage(url);
        return this;
    }

    setThumbnail(url: string) {
        this.builder.setThumbnail(url);
        return this;
    }

    setTitle(title: string, args: Record<string, any> = {}): this {
        this.builder.setTitle(args.raw ? title : this.getOne(title, this.locale, args));
        return this;
    }

    setURL(url: string) {
        this.builder.setURL(url);
        return this;
    }

    setTimestamp(timestamp: Date | number | null = Date.now()) {
        this.builder.setTimestamp(timestamp);
        return this;
    }

    setFields(...fields: LocaleFieldOptions[]) {
        this.builder.setFields(fields.map(field => this.mapField(field)));
        return this;
    }

    spliceFields(index: number, deleteCount: number, ...fields: LocaleFieldOptions[]) {
        this.builder.spliceFields(index, deleteCount, ...fields.map(field => this.mapField(field)));
        return this;
    }
}
