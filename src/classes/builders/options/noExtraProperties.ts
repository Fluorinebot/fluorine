import { BaseOption } from '#options';
import {
    SlashCommandAttachmentOption,
    ApplicationCommandOptionType,
    SlashCommandBooleanOption,
    SlashCommandMentionableOption,
    SlashCommandRoleOption,
    SlashCommandUserOption
} from 'discord.js';

// this file contains options that DO NOT modify from BaseOption

// https://discord.js.org/#/docs/builders/main/class/SlashCommandAttachmentOption
export class AttachmentOption extends BaseOption<SlashCommandAttachmentOption> {
    constructor() {
        super(ApplicationCommandOptionType.Attachment);
        this.builder = new SlashCommandAttachmentOption();
    }
}

// https://discord.js.org/#/docs/builders/main/class/SlashCommandBooleanOption
export class BooleanOption extends BaseOption<SlashCommandBooleanOption> {
    constructor() {
        super(ApplicationCommandOptionType.Boolean);
        this.builder = new SlashCommandBooleanOption();
    }
}

// https://discord.js.org/#/docs/builders/main/class/SlashCommandMentionableOption
export class MentionableOption extends BaseOption<SlashCommandMentionableOption> {
    constructor() {
        super(ApplicationCommandOptionType.Mentionable);
        this.builder = new SlashCommandMentionableOption();
    }
}

// https://discord.js.org/#/docs/builders/main/class/SlashCommandRoleOption
export class RoleOption extends BaseOption<SlashCommandRoleOption> {
    constructor() {
        super(ApplicationCommandOptionType.Role);
        this.builder = new SlashCommandRoleOption();
    }
}

// https://discord.js.org/#/docs/builders/main/class/SlashCommandUserOption
export class UserOption extends BaseOption<SlashCommandUserOption> {
    constructor() {
        super(ApplicationCommandOptionType.User);
        this.builder = new SlashCommandUserOption();
    }
}
