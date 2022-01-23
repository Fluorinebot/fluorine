import { Command } from 'types/command.type';

export default function category(cmd: Command) {
    enum Category {
        tools = 'Narzędzia',
        fun = 'Zabawa',
        moderation = 'Moderacja',
        dev = 'Developerskie'
    }

    return Category[cmd.help.category];
}
