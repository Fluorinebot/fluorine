import { SlashCommandAttachmentOption, ApplicationCommandOptionType } from 'discord.js';
import { BaseOptionBuilder } from '#builderBases';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandAttachmentOption
export class AttachmentOption extends BaseOptionBuilder<SlashCommandAttachmentOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Attachment, baseKey);
        this.builder = new SlashCommandAttachmentOption();
    }
}
