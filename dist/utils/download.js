import fs from 'node:fs';
import fetch from 'node-fetch';
import { fileDeleteIfExists } from './fs-utils.js';
import { validateExternalUrl } from './url-check.js';
const DEFAULT_MAX_DOWNLOAD_SIZE = 500 * 1024 * 1024;
export async function downloadFile(url, filename, maxSize = DEFAULT_MAX_DOWNLOAD_SIZE) {
    await validateExternalUrl(url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Unexpected Response ${response.statusText || response.status}`);
    }
    const contentLength = Number(response.headers.get('content-length'));
    if (contentLength && contentLength > maxSize) {
        throw new Error(`Response too large: ${contentLength} bytes exceeds limit of ${maxSize} bytes`);
    }
    const contentType = response.headers.get('content-type') ?? undefined;
    return new Promise((resolve, reject) => {
        const destination = fs.createWriteStream(filename);
        if (!response.body) {
            destination.destroy();
            reject(new Error('Bad file stream'));
            return;
        }
        const body = response.body;
        let received = 0;
        let aborted = false;
        body.on('data', (chunk) => {
            received += chunk.length;
            if (received > maxSize && !aborted) {
                aborted = true;
                body.destroy();
                destination.destroy();
                fileDeleteIfExists(filename).catch(() => {
                });
                reject(new Error(`Response too large: exceeded limit of ${maxSize} bytes`));
            }
        });
        body.pipe(destination);
        destination.on('close', () => {
            if (!aborted) {
                resolve(contentType);
            }
        });
        destination.on('error', (error) => {
            if (aborted) {
                return;
            }
            fileDeleteIfExists(filename).then(() => {
                reject(error);
            }).catch(() => {
                reject(error);
            });
        });
    });
}
//# sourceMappingURL=download.js.map