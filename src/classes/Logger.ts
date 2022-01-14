import { bold, yellow, blue, red } from 'picocolors';
export default class Logger {
    error(msg: string) {
        // get time in HH:mm:ss
        const time = new Date().toTimeString().split(' ')[0];
        console.log(bold(red(`${time} ERROR`)), msg);
    }
    log(msg: string) {
        const time = new Date().toTimeString().split(' ')[0];
        console.log(bold(blue(`${time} LOG`)), msg);
    }
    warn(msg: string) {
        const time = new Date().toTimeString().split(' ')[0];
        console.log(bold(yellow(`${time} WARN`)), msg);
    }
}
