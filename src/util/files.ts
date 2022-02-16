import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL, URL } from 'url';
import { readdir } from 'fs/promises';

// most of the logic taken from https://github.com/IanMitchell/djs-template/blob/main/apps/bot/src/lib/files.ts

/**
 * Call with `import.meta.url` to get the `__filename` equivalent
 */
export function getFilename(url: URL | string) {
    return fileURLToPath(url);
}

/**
 * Call with `import.meta.url` to get the `__dirname` equivalent
 */
export function getDirname(url: URL | string) {
    return dirname(getFilename(url));
}

export async function loadDirectory<T>(relativePath: string) {
    // see https://github.com/swc-project/swc/issues/1202#issuecomment-943788993
    const url = pathToFileURL(__filename).toString();
    const directory = join(getDirname(url), relativePath);

    const files = await readdir(directory);
    return Promise.all(files.map(async file => loadFile<T>(directory, file)));
}

export async function loadFile<T>(directory: string, file: string) {
    if (!file.endsWith('.js')) {
        return;
    }
    const data: T = await import(join(directory, file));

    return data;
}
