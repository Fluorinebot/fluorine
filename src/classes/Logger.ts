import { bold, yellow, blue, red } from 'picocolors';
export class Logger {
    static error(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(red(`${time} ERROR`)), msg);
    }
    static log(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(blue(`${time} LOG`)), msg);
    }
    static warn(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(yellow(`${time} WARN`)), msg);
    }
}
