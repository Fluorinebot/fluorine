import { bold, yellow, blue, red } from 'yoctocolors';

export class Logger {
    static error(msg: string, ...args: unknown[]) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(red(`${time} ERROR`)), msg, ...args);
    }

    static log(msg: string, ...args: unknown[]) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(blue(`${time} LOG`)), msg, ...args);
    }

    static warn(msg: string, ...args: unknown[]) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(yellow(`${time} WARN`)), msg, ...args);
    }
}
