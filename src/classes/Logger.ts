import { bold, yellow, blue, red } from 'picocolors';
// get time in HH:mm:ss
const [time] = new Date().toTimeString().split(' ');
export default class Logger {
    error(msg: string) {
        console.log(bold(red(`${time} ERROR`)), msg);
    }
    log(msg: string) {
        console.log(bold(blue(`${time} LOG`)), msg);
    }
    warn(msg: string) {
        console.log(bold(yellow(`${time} WARN`)), msg);
    }
}
