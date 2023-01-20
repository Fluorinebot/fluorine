import {
    ButtonBuilder as UnlocalizedBuilder,
    type LocalizationMap,
    type APIMessageComponentEmoji,
    type ButtonStyle
} from 'discord.js';
import { BaseComponent } from '../bases/BaseComponent';

export class ButtonBuilder extends BaseComponent<UnlocalizedBuilder> {
    label: string;

    constructor(customId: string) {
        super();
        this.builder = new UnlocalizedBuilder().setCustomId(customId);
    }

    setLabel(label: string) {
        this.label = label;
        return this;
    }

    setEmoji(emoji: APIMessageComponentEmoji) {
        this.builder.setEmoji(emoji);
        return this;
    }

    setStyle(style: ButtonStyle) {
        this.builder.setStyle(style);
        return this;
    }

    setURL(url: string) {
        this.builder.setURL(url);
        return this;
    }

    setDisabled(disabled = true) {
        this.builder.setDisabled(disabled);
        return this;
    }

    prepare(locale: keyof LocalizationMap) {
        this.builder.setLabel(this.getOne(this.label, locale));
        return this;
    }
}