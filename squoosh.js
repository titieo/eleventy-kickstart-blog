const fs = require('fs');
const path = require('path');

const { ImagePool } = require('@squoosh/lib');
const imagePool = new ImagePool();

// Define your paths:
const imagesToOptimizePath = './_imagesToOptimize/';
const moveToPath = './_originalRawImages/';
const optimizeToPath = './src/images/';

(async () => {
    const files = await fs.promises.readdir(imagesToOptimizePath);

    for (const file of files) {
        await libSquooshOptimize(file);
    }

    await imagePool.close();
})();

async function libSquooshOptimize(file) {
    const imagePath = path.join(imagesToOptimizePath, file);
    const moveOriginalToPath = path.join(moveToPath, file);
    const saveOptimizedImageToPath = path.join(
        optimizeToPath,
        path.parse(file).name,
    );
    console.log({ imagePath });

    const image = imagePool.ingestImage(imagePath);
    await image.decoded; // Wait until the image is decoded before running preprocessors

    // const preprocessOptions = {
    //   resize: {
    //     enabled: true,
    //     width: 720,
    //   }
    // };
    // await image.preprocess(preprocessOptions);

    const encodeOptions = {
        // an empty object means 'use default settings'
        webp: {},
        oxipng: {},
    };
    await image.encode(encodeOptions);

    for (const encodedImage of Object.values(image.encodedWith)) {
        const { extension, binary } = await encodedImage;
        const optimizedImagePath = `${saveOptimizedImageToPath}.${extension}`;
        fs.writeFile(optimizedImagePath, binary, (err) => {
            if (err) throw err;
            console.log({ optimizedImagePath });
        });
    }

    // move original image async
    await fs.promises.rename(imagePath, moveOriginalToPath);
}
