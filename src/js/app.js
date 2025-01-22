import * as flsFunction from './modules/functions.js';
flsFunction.isWebp();
//ванильный js

document.addEventListener('DOMContentLoaded', () => {
	for (let e of document.querySelectorAll('input[type="range"]')) {
		const min = e.min == '' ? 0 : e.min;
		const max = e.max == '' ? 100 : e.max;
		const container = e.closest('.cost__range');
		let spanValue = '';
		const marks = [10000, 100000, 500000, 1000000, 5000000, 10000000];
		if (container) {
			spanValue = container.querySelector('.value-tip');
			updateContainer('data-min', marks[0]); // Минимальное значение
			updateContainer('data-max', marks[marks.length - 1]); // Максимальное значение
			updateValue();
		}

		e.style.setProperty('--value', e.value);
		e.style.setProperty('--min', min);
		e.style.setProperty('--max', max);

		e.addEventListener('input', () => {
			// snapToMark();
			updateValue();

		});
		function snapToMark() {
			const closestMark = marks.reduce((prev, curr) => {
				return Math.abs(curr - e.value) < Math.abs(prev - e.value) ? curr : prev;
			});
			e.value = closestMark; // Устанавливаем значение на ближайшую отметку
		}
		function updateValue() {
			const val = Math.floor(parseFloat(e.value));
			e.style.setProperty('--value', e.value);
			if (spanValue) {
				const containerWidth = e.offsetWidth;
				const persentage = (e.value / max);

				spanValue.style.left = (persentage * containerWidth + ((50 - persentage * 100) / 10 * 3)) + "px";
				spanValue.querySelector('span').innerText = marks[val] > 999999 ? (marks[val] / 1000000) + 'm' : (marks[val] / 1000) + 'k';
			}
			document.querySelector('.cost__sum .value').innerText = formatNumber(marks[val] * 2);
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

	const scrollAnimation = new ScrollAnimation('.animate-on-scroll');
	scrollAnimation.applyAnimations();


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

class ScrollAnimation {
	constructor(selector = '.hidden') {
		this.selector = selector;
		window.addEventListener('resize', this.onResize.bind(this));
	}
	onResize() {
		const currentHeight = window.innerHeight;
		if (Math.abs(currentHeight - this.previousHeight) > 100) {
			this.previousHeight = currentHeight;
			this.updateObserver();
		}
	}
	applyAnimations() {
		const elements = document.querySelectorAll(this.selector);
		elements.forEach((el) => {
			const animationType = el.getAttribute('data-animation-type') || 'fade';
			const duration = parseFloat(el.getAttribute('data-animation-duration')) || 1;
			const delay = parseFloat(el.getAttribute('data-animation-delay')) || 0;
			const offsetBottom = parseFloat(el.getAttribute('data-animation-offset-bottom')) || 10;
			const rootMargin = `${0}px ${0}px -${(window.innerHeight * offsetBottom) / 100}px ${0}px`;
			el.style.transition = `opacity ${duration}s ease`;
			el.style.opacity = '0';
			if (animationType === 'slide') {
				el.style.transition += `, transform ${duration}s ease`;
				el.style.transform = 'translateY(10%)';
			}
			const observerOptions = {
				root: null,
				rootMargin: rootMargin,
				threshold: 0.1,
			};
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.style.transitionDelay = `${delay}s`;
						entry.target.style.opacity = '1';
						if (animationType === 'slide') {
							entry.target.style.transform = 'translateY(0)';
						}
						observer.unobserve(entry.target);
					}
				});
			}, observerOptions);
			observer.observe(el);
		});
	}
	updateObserver() {
		const elements = document.querySelectorAll(this.selector);
		elements.forEach((el) => {
			const animationType = el.getAttribute('data-animation-type') || 'fade';
			const duration = parseFloat(el.getAttribute('data-animation-duration')) || 1;
			const delay = parseFloat(el.getAttribute('data-animation-delay')) || 0;
			const offsetBottom = parseFloat(el.getAttribute('data-animation-offset-bottom')) || 10;
			const rootMargin = `${0}px ${0}px -${(window.innerHeight * offsetBottom) / 100}px ${0}px`;
			el.style.transition = `opacity ${duration}s ease`;
			el.style.opacity = '0';
			if (animationType === 'slide') {
				el.style.transition += `, transform ${duration}s ease`;
				el.style.transform = 'translateY(10%)';
			}
			const observerOptions = {
				root: null,
				rootMargin: rootMargin,
				threshold: 0.5,
			};
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.style.transitionDelay = `${delay}s`;
						entry.target.style.opacity = '1';
						if (animationType === 'slide') {
							entry.target.style.transform = 'translateY(0)';
						}
						observer.unobserve(entry.target);
					}
				});
			}, observerOptions);
			observer.observe(el);
		});
	}
}

const scrollAnimation = new ScrollAnimation('.animate-on-scroll');
scrollAnimation.applyAnimations();
