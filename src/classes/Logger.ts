import { bold, yellow, blue, red } from "nanocolors";
import dayjs from "dayjs";
export default class Logger {
	constructor() {}
	error(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(bold(red(`${time} ERROR`)), msg);
	}
	log(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(bold(blue(`${time} LOG`)), msg);
	}
	warn(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(bold(yellow(`${time} WARN`)), msg);
	}
}
