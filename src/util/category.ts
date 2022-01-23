import { Command } from 'types/command';

export default function category(cmd: Command) {
    enum Category {
        tools = 'Narzędzia',
        fun = 'Zabawa',
        moderation = 'Moderacja',
        dev = 'Developerskie'
    }

    return Category[cmd.help.category];
}
