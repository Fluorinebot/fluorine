import { command } from 'types/command';

export default function category(cmd: command) {
    enum Category {
        tools = 'Narzędzia',
        fun = 'Zabawa',
        moderation = 'Moderacja',
        dev = 'Developerskie'
    }

    return Category[cmd.help.category];
}
