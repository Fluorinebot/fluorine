import chalk from "chalk";
import dayjs from "dayjs";
export default class Logger {
	constructor() {}
	error(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(chalk.bold.red(`${time} error`), msg);
	}
	log(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(chalk.bold.blue(`${time} log`), msg);
	}
	warn(msg: string) {
		const time = dayjs(Date.now()).format("HH:mm:ss");
		console.log(chalk.bold.yellow(`${time} log`), msg);
	}
}
