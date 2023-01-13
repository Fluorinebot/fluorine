import {
    AttachmentOption,
    BaseCommand,
    BooleanOption,
    ChannelOption,
    IntegerOption,
    MentionableOption,
    NumberOption,
    RoleOption,
    StringOption,
    UserOption,
    type BaseOption
} from '#builders';
import {
    SlashCommandBuilder,
    type ApplicationCommandOptionType,
    type ApplicationCommandType,
    type SlashCommandSubcommandBuilder
} from 'discord.js';

export class CommandWithOptions<T extends SlashCommandBuilder | SlashCommandSubcommandBuilder> extends BaseCommand<T> {
    public optionQueue: BaseOption<any>[];

    constructor(type: ApplicationCommandType.ChatInput | ApplicationCommandOptionType.Subcommand, baseKey: string) {
        super(type, baseKey);
        this.optionQueue = [];
    }

    private addOption(input: BaseOption<any>) {
        if (this.builder instanceof SlashCommandBuilder) {
            this.mapOption(input);
        }

        this.optionQueue.push(input);
    }

    private mapOption(option: BaseOption<any>) {
        if (option instanceof AttachmentOption) {
            this.builder.addAttachmentOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        } else if (option instanceof BooleanOption) {
            this.builder.addBooleanOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        } else if (option instanceof ChannelOption) {
            this.builder.addChannelOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        } else if (option instanceof IntegerOption) {
            this.builder.addIntegerOption(
                option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).prepareChoices().builder
            );
        } else if (option instanceof MentionableOption) {
            this.builder.addMentionableOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        } else if (option instanceof NumberOption) {
            this.builder.addNumberOption(
                option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).prepareChoices().builder
            );
        } else if (option instanceof RoleOption) {
            this.builder.addRoleOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        } else if (option instanceof StringOption) {
            this.builder.addStringOption(
                option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).prepareChoices().builder
            );
        } else if (option instanceof UserOption) {
            this.builder.addUserOption(option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`).builder);
        }
    }

    addAttachmentOption(key: string, input: (option: AttachmentOption) => AttachmentOption = option => option) {
        this.addOption(input(new AttachmentOption(key)));
        return this;
    }

    addBooleanOption(key: string, input: (option: BooleanOption) => BooleanOption = option => option) {
        this.addOption(input(new BooleanOption(key)));
        return this;
    }

    addChannelOption(key: string, input: (option: ChannelOption) => ChannelOption = option => option) {
        this.addOption(input(new ChannelOption(key)));
        return this;
    }

    addIntegerOption(key: string, input: (option: IntegerOption) => IntegerOption = option => option) {
        this.addOption(input(new IntegerOption(key)));
        return this;
    }

    addMentionableOption(key: string, input: (option: MentionableOption) => MentionableOption = option => option) {
        this.addOption(input(new MentionableOption(key)));
        return this;
    }

    addNumberOption(key: string, input: (option: NumberOption) => NumberOption = option => option) {
        this.addOption(input(new NumberOption(key)));
        return this;
    }

    addRoleOption(key: string, input: (option: RoleOption) => RoleOption = option => option) {
        this.addOption(input(new RoleOption(key)));
        return this;
    }

    addStringOption(key: string, input: (option: StringOption) => StringOption = option => option) {
        this.addOption(input(new StringOption(key)));
        return this;
    }

    addUserOption(key: string, input: (option: UserOption) => UserOption = option => option) {
        this.addOption(input(new UserOption(key)));
        return this;
    }

    prepareOptions() {
        // console.log('hi');
        for (const option of this.optionQueue) {
            this.mapOption(option);
        }

        return this;
    }
}
