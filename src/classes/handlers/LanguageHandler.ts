import { readdirSync } from 'fs';
import { Languages, LanguageStrings, LanguageType } from 'types/language';
export default class LanguageHandler {
    languages: Record<Languages, LanguageType>;
    constructor() {
        this.languages = {} as Record<Languages, LanguageType>;
        const languageFiles = readdirSync(`${__dirname}/../../../i18n`);
        languageFiles.forEach(async file => {
            const [name] = file.split('.');
            this.languages[name] = await import(
                `${__dirname}/../../../i18n/${file}`
            );
        });
    }

    get<Key extends LanguageStrings>(
        language: string,
        key: Key,
        args: Record<string, unknown> = {}
    ): LanguageType[Key] {
        const lang = this.languages[language] ?? this.languages['en-US'];
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
