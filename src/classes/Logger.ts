import { bold, yellow, blue, red } from 'picocolors';
import dayjs from 'dayjs';
export default class Logger {
    error(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(red(`${time} ERROR`)), msg);
    }
    log(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(blue(`${time} LOG`)), msg);
    }
    warn(msg: string) {
        const [time] = new Date().toTimeString().split(' ');
        console.log(bold(yellow(`${time} WARN`)), msg);
    }
}
