import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandAttachmentOption } from 'discord.js';

export class AttachmentOption extends BaseOptionBuilder<SlashCommandAttachmentOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Attachment, baseKey);
        this.builder = new SlashCommandAttachmentOption();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
