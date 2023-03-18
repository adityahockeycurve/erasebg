const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = null;

const imageUpload = document.getElementById('imageUpload');
imageUpload.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        image = new Image();
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

const eraseButton = document.getElementById('eraseButton');
eraseButton.addEventListener('click', function() {
    if (image !== null) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const numPixels = imageData.width * imageData.height;

        // Get the average color of the image
        const avgColor = getAverageColor(pixels, numPixels);

        // Set the chroma key range
        const range = 80;

        // Remove all pixels that fall within the chroma key range
        for (let i = 0; i < numPixels; i++) {
            const pixelColor = getPixelColor(pixels, i);
            if (isWithinRange(pixelColor, avgColor, range)) {
                pixels[i * 4 + 3] = 0; // Set alpha to 0 (fully transparent)
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
});

function getPixelColor(pixels, i) {
    return {
        red: pixels[i * 4],
        green: pixels[i * 4 + 1],
        blue: pixels[i * 4 + 2],
    };
}

function getAverageColor(pixels, numPixels) {
    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;
    for (let i = 0; i < numPixels; i++) {
        totalRed += pixels[i * 4];
        totalGreen += pixels[i * 4 + 1];
        totalBlue += pixels[i * 4 + 2];
    }
    return {
        red: Math.round(totalRed / numPixels),
        green: Math.round(totalGreen / numPixels),
        blue: Math.round(totalBlue / numPixels),
    };
}

function isWithinRange(color, target, range) {
    const rDiff = Math.abs(color.red - target.red);
    const gDiff = Math.abs(color.green - target.green);
    const bDiff = Math.abs(color.blue - target.blue);
    return rDiff <= range && gDiff <= range && bDiff <= range;
}
