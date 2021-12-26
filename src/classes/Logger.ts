import { bold, yellow, blue, red } from 'picocolors';
export default class Logger {
    error(msg: string) {
        const date = new Date();
        const [hour, minutes, seconds] = [
            `0${date.getHours()}`.slice(-2),
            `0${date.getMinutes()}`.slice(-2),
            `0${date.getSeconds()}`.slice(-2)
        ];
        const time = `${hour}-${minutes}-${seconds}`;
        console.log(bold(red(`${time} ERROR`)), msg);
    }
    log(msg: string) {
        const date = new Date();
        const [hour, minutes, seconds] = [
            `0${date.getHours()}`.slice(-2),
            `0${date.getMinutes()}`.slice(-2),
            `0${date.getSeconds()}`.slice(-2)
        ];
        const time = `${hour}-${minutes}-${seconds}`;
        console.log(bold(blue(`${time} LOG`)), msg);
    }
    warn(msg: string) {
        const date = new Date();
        const [hour, minutes, seconds] = [
            `0${date.getHours()}`.slice(-2),
            `0${date.getMinutes()}`.slice(-2),
            `0${date.getSeconds()}`.slice(-2)
        ];
        const time = `${hour}-${minutes}-${seconds}`;
        console.log(bold(yellow(`${time} WARN`)), msg);
    }
}
