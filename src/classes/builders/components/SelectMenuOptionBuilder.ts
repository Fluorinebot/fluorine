import {
    SelectMenuOptionBuilder as UnlocalizedBuilder,
    type ComponentEmojiResolvable,
    type LocalizationMap
} from 'discord.js';
import { BaseComponent } from '../bases/BaseComponent';

export class SelectMenuOptionBuilder extends BaseComponent<UnlocalizedBuilder> {
    label: string;
    description: string;

    constructor(value: string) {
        super();
        this.builder = new UnlocalizedBuilder().setValue(value);
    }

    setLabel(label: string) {
        this.label = label;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setDefault(value = true) {
        this.builder.setDefault(value);
        return this;
    }

    setEmoji(emoji: ComponentEmojiResolvable) {
        this.builder.setEmoji(emoji);
        return this;
    }

    prepare(locale: keyof LocalizationMap) {
        this.builder.setLabel(this.getOne(this.label, locale));

        if (this.description) {
            this.builder.setDescription(this.getOne(this.description, locale));
        }

        return this;
    }
}
