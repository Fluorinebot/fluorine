import { TextInputBuilder as UnlocalizedBuilder, type LocalizationMap, type TextInputStyle } from 'discord.js';
import { BaseComponent } from '../bases/BaseComponent';

export class TextInputBuilder extends BaseComponent<UnlocalizedBuilder> {
    label: string;
    placeholder: string;

    constructor(customId: string) {
        super();
        this.builder = new UnlocalizedBuilder().setCustomId(customId);
    }

    setLabel(label: string) {
        this.label = label;
        return this;
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    setMaxLength(value: number) {
        this.builder.setMaxLength(value);
        return this;
    }

    setMinLength(value: number) {
        this.builder.setMinLength(value);
        return this;
    }

    setRequired(required = true) {
        this.setRequired(required);
        return this;
    }

    setStyle(style: TextInputStyle) {
        this.builder.setStyle(style);
        return this;
    }

    prepare(locale: keyof LocalizationMap) {
        this.builder.setLabel(this.getOne(this.label, locale));

        if (this.placeholder) {
            this.builder.setPlaceholder(this.getOne(this.placeholder, locale));
        }

        return this;
    }
}
