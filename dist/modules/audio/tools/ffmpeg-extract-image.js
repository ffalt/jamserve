import ffmpeg from 'fluent-ffmpeg';
export async function extractFFmpegImage(filename, index, stream) {
    return new Promise((resolve, reject) => {
        const proc = ffmpeg({ source: filename })
            .addOption('-map', `0:${index}`)
            .toFormat('mjpeg')
            .on('end', () => {
            resolve();
        })
            .on('error', err => {
            reject(err);
        });
        proc.writeToStream(stream, { end: true });
    });
}
//# sourceMappingURL=ffmpeg-extract-image.js.map