import * as flsFunction from './modules/functions.js';
flsFunction.isWebp();

function getRandomRotation() {
	const rotation = Math.random() * 60 - 30; // От -30 до 30 градусов
	return rotation;
}

function createGridPositions(cols, rows) {
	return Array.from({ length: cols * rows }, (_, index) => ({
		row: Math.floor(index / cols),
		col: index % cols
	})).sort(() => Math.random() - 0.5);
}

function createBlock(originalBlock, position, cellWidth, cellHeight, baseY = 0, shift, zIndex) {
	const newBlock = originalBlock.cloneNode(true);
	const randomOffsetX = (Math.random() - 0.5) * (cellWidth * shift);
	const randomOffsetY = (Math.random() - 0.5) * (cellHeight * shift);
	const x = position.col * cellWidth + randomOffsetX;
	const y = baseY + (position.row * cellHeight) + randomOffsetY;
	const rotation = getRandomRotation();

	Object.assign(newBlock.style, {
		left: `${x}px`,
		top: `${y}px`,
		transform: `rotate(${rotation}deg)`,
		visibility: 'visible',
		zIndex: 10 * zIndex
	});

	return newBlock;
}

function animateBlock(block, index, targetContainer, speed = 0.5) {
	const finalY = block.style.top;
	const finalX = block.style.left;
	const finalRotation = block.style.transform.replace(/[^\d-\.]/g, '');

	gsap.set(block, { top: "-100%", left: finalX, rotation: 0 });
	targetContainer.appendChild(block);
	gsap.to(block, {
		top: finalY,
		rotation: finalRotation,
		duration: speed,
		delay: index * 0.05,
		ease: "power1.out"
	});
}

function generateBlocks(container, blocks, totalBlocks, baseY, shift, zIndex) {

	const gridCols = Math.ceil(Math.sqrt(totalBlocks));
	const gridRows = Math.ceil(totalBlocks / gridCols);

	const cellWidth = container.offsetWidth / gridCols;
	const cellHeight = (container.offsetHeight - baseY) / gridRows;

	const gridPositions = createGridPositions(gridCols, gridRows);

	const copiesPerBlock = Math.floor(totalBlocks / blocks.length);

	const remainingBlocks = totalBlocks % blocks.length;

	let positionIndex = 0;
	let allBlocksToAdd = [];

	blocks.forEach((originalBlock, index) => {
		const copies = index < remainingBlocks ? copiesPerBlock + 1 : copiesPerBlock;
		for (let i = 0; i < copies && positionIndex < gridPositions.length; i++) {
			allBlocksToAdd.push(createBlock(originalBlock, gridPositions[positionIndex++], cellWidth, cellHeight, baseY, shift, zIndex));
		}
	});

	return allBlocksToAdd.sort((a, b) => parseFloat(b.style.top) - parseFloat(a.style.top));
}

function cloneAndPlaceBlocks(container) {

	const blocks = container.querySelectorAll('.meme__item'); // Блоки
	const totalBlocks = parseInt(container.getAttribute('data-total-blocks')) || 30; // Общее количество блоков
	const shift = parseFloat(container.getAttribute('data-shift')) || 0.5;
	container.innerHTML = ''; // Очистка контейнера


	const blocksToAdd = generateBlocks(container, blocks, Math.max(Math.ceil(totalBlocks / 3), blocks.length), container.offsetHeight / 2, shift, 1);
	blocksToAdd.forEach((block, index) => animateBlock(block, index, container));

	globalStartBlocks.push(blocks);
	globalTotalBlocks.push(totalBlocks);
	globalBlocksToAdd.push(blocksToAdd.length);


}

function animateRemainingBlocks(container, index) {
	const shift = parseFloat(container.getAttribute('data-shift')) || 0.5;
	const remainingBlocksCount = globalTotalBlocks[index] - globalBlocksToAdd[index];
	const newBlocks = generateBlocks(container, globalStartBlocks[index], remainingBlocksCount, 0, shift, 1);
	newBlocks.forEach((block, idx) => animateBlock(block, idx, container, 0.3));
	globalNextBlocks.push(newBlocks);
}

function animateBlockFinish(block, index) {
	gsap.to(block, { top: '100%', duration: 0.3, delay: index * 0.05 });
}

let globalBlocksToAdd = [], globalTotalBlocks = [], globalStartBlocks = [], globalNextBlocks = [];

const containers = document.querySelectorAll('.background-container');

containers.forEach((container) => {
	cloneAndPlaceBlocks(container);
});


document.querySelector('.meme__form_code form').addEventListener('submit', (e) => {
	e.preventDefault();
	containers.forEach((container, index) => {
		animateRemainingBlocks(container, index);
	});
	console.log(globalNextBlocks);

	let timelineCodeEnter = gsap.timeline();
	timelineCodeEnter.to(".background-container_img", { zIndex: 20, duration: 0.3 });
	timelineCodeEnter.to(".meme__form_code", { zIndex: 1, duration: 0.3 });
	timelineCodeEnter.to(".meme__form_login", { top: '50%', duration: 1, ease: "power1.out" });
	timelineCodeEnter.to(".meme__form_code", {
		opacity: 0, duration: 0.3, onComplete: () => {
			document.querySelector('.meme__form_code').style.display = 'none';
		}
	}, '>');
});
document.getElementById('telegramButton').addEventListener('click', function () {
	globalNextBlocks.forEach((block, index) => {
		animateBlockFinish(block, index);
	});
	let timelineTelegram = gsap.timeline();
	timelineTelegram.to(".meme__form_login", { top: '150%', duration: 0.5 });
	timelineTelegram.to(".meme__form_finish", { top: '43%', duration: 1, ease: "power1.out" }, '<');
});
document.getElementById('copyButton').addEventListener('click', function () {
	const referralLink = document.getElementById('referralLink').innerText;
	navigator.clipboard.writeText(referralLink).then(() => {
		alert('Ссылка скопирована в буфер обмена!');
	}).catch(err => {
		console.error('Ошибка при копировании: ', err);
	});
});