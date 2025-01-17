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

document.addEventListener('DOMContentLoaded', () => {
	for (let e of document.querySelectorAll('input[type="range"]')) {
		const min = e.min == '' ? 0 : e.min;
		const max = e.max == '' ? 100 : e.max;
		const container = e.closest('.cost__range');
		let spanValue = '';
		if (container) {
			spanValue = container.querySelector('.value-tip');
			updateContainer('data-min', min);
			updateContainer('data-max', max);
			updateValue();
		}

		e.style.setProperty('--value', e.value);
		e.style.setProperty('--min', min);
		e.style.setProperty('--max', max);

		e.addEventListener('input', () => {
			updateValue();

		});

		function updateValue() {
			e.style.setProperty('--value', e.value);
			if (spanValue) {
				const containerWidth = e.offsetWidth;
				const persentage = (e.value / max);

				spanValue.style.left = (persentage * containerWidth) + "px";
				spanValue.querySelector('span').innerText = e.value;
			}
			document.querySelector('.cost__sum .value').innerText = formatNumber(e.value * 2000);
		}
		function updateContainer(attr, value) {
			container.setAttribute(attr, formatNumber(value));
		}

	}

	const reviewsSlider = new Swiper('.reviews__slider', {
		loop: true,
		slidesPerView: 'auto',
		watchSlidesProgress: true,
	});


});

//если подключен jq

// $(document).ready(function () {



// });
function formatNumber(number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	}).format(number);
}