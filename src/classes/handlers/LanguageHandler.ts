import { readdirSync } from 'fs';
import { Languages, LanguageStrings } from 'types/language.type';
export default class LanguageHandler {
    languages: any;
    constructor() {
        this.languages = {};
        const languageFiles = readdirSync(`${__dirname}/../../../i18n`);
        languageFiles.forEach(async file => {
            const [name] = file.split('.');
            this.languages[name] = await import(
                `${__dirname}/../../../i18n/${file}`
            );
        });
    }

    get(
        language: Languages,
        key: LanguageStrings,
        args: Record<string, unknown> = {}
    ) {
        const lang = this.languages[language];
        let string;
        if (key.includes('.')) {
            const keys = key.split('.');
            string = lang[keys[0]][keys[1]];
        } else {
            string = lang[key];
        }

        for (const [key, value] of Object.entries(args)) {
            string = string.replaceAll(`[${key}]`, value);
        }
        return string;
    }
}
