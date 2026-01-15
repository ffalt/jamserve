import ffmpeg from './ffmpeg.js';
import { fileSuffix } from '../../../utils/fs-utils.js';
export async function rewriteWriteFFmpeg(filename, destination) {
    return new Promise((resolve, reject) => {
        const proc = ffmpeg({ source: filename })
            .addOption('-c:a', 'copy')
            .addOption('-c:v', 'copy')
            .addOption('-map_metadata', '-1')
            .output(destination)
            .format(fileSuffix(filename));
        proc.on('end', () => {
            resolve();
        }).on('error', (error) => {
            reject(error);
        });
        proc.run();
    });
}
//# sourceMappingURL=ffmpeg-rewrite.js.map