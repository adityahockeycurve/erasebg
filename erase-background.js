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
		
		// Calculate the average color of the pixels in the corners of the image
		const cornerColors = [
			getPixelColor(pixels, 0, 0),
			getPixelColor(pixels, imageData.width - 1, 0),
			getPixelColor(pixels, 0, imageData.height - 1),
			getPixelColor(pixels, imageData.width - 1, imageData.height - 1)
		];
		const avgColor = getAverageColor(cornerColors);
		
		// Remove all pixels that are within a certain color distance from the average color
		const colorDistanceThreshold = 50; // Adjust this value as needed
		for (let i = 0; i < numPixels; i++) {
			const pixelColor = getPixelColor(pixels, i);
			const colorDistance = getColorDistance(pixelColor, avgColor);
			if (colorDistance < colorDistanceThreshold) {
				pixels[i * 4 + 3] = 0; // Set alpha to 0 (fully transparent)
			}
		}
		
		ctx.putImageData(imageData, 0, 0);
	}
});

function getPixelColor(pixels, x, y) {
	const i = (y * imageData.width + x) * 4;
	return {
		red: pixels[i],
		green: pixels[i + 1],
		blue: pixels[i + 2]
	};
}

function getAverageColor(colors) {
	const numColors = colors.length;
	let totalRed = 0;
	let totalGreen = 0;
	let totalBlue = 0;
	for (let i = 0; i < numColors; i++) {
		totalRed += colors[i].red;
		totalGreen += colors[i].green;
		totalBlue += colors[i].blue;
	}
	return {
		red: Math.round(totalRed / numColors),
		green: Math.round(totalGreen / numColors),
		blue: Math.round(totalBlue / numColors)
	};
}

function getColorDistance(color1, color2) {
	const redDiff = color1.red - color2.red;
	const greenDiff = color1.green - color2.green;
	const blueDiff = color1.blue - color2.blue;
	return Math.sqrt(redDiff * redDiff + greenDiff * greenDiff + blueDiff * blueDiff);
}
