document.addEventListener("DOMContentLoaded", function () {
	const section = document.querySelector(".seo-tools-section");
	const track = document.querySelector(".seo-tools-track");

	if (!section || !track) {
		return;
	}

	let offset = 0;
	let lastTime = performance.now();
	let paused = false;
	const speed = 75;
	const originalTools = Array.from(track.children);

	while (track.scrollWidth < section.clientWidth * 2) {
		originalTools.forEach(function (tool) {
			track.appendChild(tool.cloneNode(true));
		});
	}

	section.addEventListener("mouseenter", function () {
		paused = true;
	});

	section.addEventListener("mouseleave", function () {
		paused = false;
	});

	function moveTools(time) {
		const elapsed = Math.min(time - lastTime, 50);
		lastTime = time;

		if (!paused) {
			offset -= speed * elapsed / 1000;

			const firstTool = track.firstElementChild;
			if (firstTool) {
				const firstWidth = firstTool.getBoundingClientRect().width;
				const firstStyle = getComputedStyle(firstTool);
				const firstMarginLeft = parseFloat(firstStyle.marginLeft);
				const firstMargin = parseFloat(firstStyle.marginRight);
				const firstStep = firstWidth + firstMarginLeft + firstMargin;

				if (Math.abs(offset) >= firstStep) {
					track.appendChild(firstTool);
					offset += firstStep;
				}
			}

			track.style.transform = `translateX(${offset}px)`;
		}

		requestAnimationFrame(moveTools);
	}

	requestAnimationFrame(moveTools);
});
