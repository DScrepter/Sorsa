import * as flsFunction from './modules/functions.js';
import SmoothScroll from 'smoothscroll-for-websites';
flsFunction.isWebp();

// если нужен настраиваемы плавный скролл
SmoothScroll({
	animationTime: 1000,
	stepSize: 200,
	// Acceleration
	accelerationDelta: 200,  // 50
	accelerationMax: 3,   // 3

	// Keyboard Settings
	keyboardSupport: true,  // option
	arrowScroll: 300,    // [px]

	// Pulse (less tweakable)
	// ratio of "tail" to "acceleration"
	pulseAlgorithm: true,
	pulseScale: 4,
	pulseNormalize: 1,

	// Other
	touchpadSupport: false, // ignore touchpad by default
	fixedBackground: true,
	excluded: ''
});

//ванильный js

// document.addEventListener('DOMContentLoaded', () => {
	


// });

//если подключен jq

// $(document).ready(function () {
	


// });
