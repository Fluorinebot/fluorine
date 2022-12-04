import { lstat, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, type URL } from 'node:url';

type Child<T> = { name: string; data: T };

/**
 * Call with `import.meta.url` to get the `__dirname` equivalent
 */
export function getDirname(url: URL | string) {
    return dirname(getFilename(url));
}

/**
 * Call with `import.meta.url` to get the `__filename` equivalent
 */
export function getFilename(url: URL | string) {
    return fileURLToPath(url);
}

export async function loadParentDirectory<ParentT, ChildT>(relativePath: string) {
    const result: [ParentT[], Child<ChildT>[]] = [[], []];

    const parentDirectory = join(getDirname(import.meta.url), relativePath);
    const parentFiles = await readdir(parentDirectory);

    for (const parentFile of parentFiles) {
        if (parentFile.endsWith('.js') || parentFile.endsWith('.ts')) {
            result[0].push((await loadFile<ParentT>(parentDirectory, parentFile)).data);
        } else {
            const directory = join(parentDirectory, parentFile);
            const file = await lstat(directory);

            if (file.isDirectory()) {
                const relativeDirectory = join(relativePath, parentFile);

                result[1].push(
                    ...(await loadDirectory<ChildT>(relativeDirectory)).map((data) => ({
                        name: `${parentFile}/${data.name}`,
                        data: data.data
                    }))
                );
            }
        }
    }

    return result;
}

export async function loadDirectory<T>(relativePath: string) {
    const directory = join(getDirname(import.meta.url), relativePath);

    const files = (await readdir(directory)).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));
    return Promise.all(files.map(async (file) => loadFile<T>(directory, file)));
}

export async function loadFile<T>(directory: string, file: string) {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) {
        return;
    }

    const [name] = file.split('.');
    const data: T = await import(`file:${join(directory, file)}`);

    return { name, data };
}
