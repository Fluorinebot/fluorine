import { SlashCommandAttachmentOption, ApplicationCommandOptionType } from 'discord.js';
import { BaseOption } from '#builderBases';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandAttachmentOption
export class AttachmentOption extends BaseOption<SlashCommandAttachmentOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Attachment, baseKey);
        this.builder = new SlashCommandAttachmentOption();
    }
}
