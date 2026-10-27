document.addEventListener("DOMContentLoaded", function () {
	const menuToggle = document.querySelector(".menu-toggle");
	const navigation = document.querySelector(".nav-links");
	const serviceDropdown = document.querySelector(".nav-dropdown");
	const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
	const serviceMenu = document.querySelector(".service-menu");
	const navbar = serviceDropdown && serviceDropdown.closest(".navbar");
	let isMobileNavigation = window.matchMedia("(max-width: 900px)").matches;
	const positionServiceMenu = function () {
		if (!serviceDropdown || !serviceMenu || !navbar || window.matchMedia("(max-width: 900px)").matches) {
			return;
		}

		const dropdownBounds = serviceDropdown.getBoundingClientRect();
		const navbarBounds = navbar.getBoundingClientRect();
		const menuWidth = serviceMenu.offsetWidth;
		const left = Math.max(16, Math.min(
			dropdownBounds.left + dropdownBounds.width / 2 - menuWidth / 2,
			window.innerWidth - menuWidth - 16
		));
		navbar.style.setProperty("--service-menu-left", `${left - navbarBounds.left}px`);
	};
	const setDropdownOpen = function (isOpen) {
		if (serviceDropdown && dropdownToggle) {
			if (isOpen) {
				positionServiceMenu();
			}
			serviceDropdown.classList.toggle("is-open", isOpen);
			serviceDropdown.classList.toggle("is-dismissed", !isOpen);
			dropdownToggle.setAttribute("aria-expanded", String(isOpen));
		}
	};
	const closeNavigation = function () {
		if (navigation) {
			navigation.classList.remove("is-open");
		}
		if (menuToggle) {
			menuToggle.setAttribute("aria-expanded", "false");
			menuToggle.setAttribute("aria-label", "Open navigation menu");
		}
		setDropdownOpen(false);
	};

	if (menuToggle && navigation) {
		menuToggle.addEventListener("click", function () {
			const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
			menuToggle.setAttribute("aria-expanded", String(!isOpen));
			menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
			navigation.classList.toggle("is-open", !isOpen);
			if (isOpen) {
				setDropdownOpen(false);
			}
		});

		navigation.addEventListener("click", function (event) {
			if (event.target instanceof Element && event.target.closest("a") && window.matchMedia("(max-width: 900px)").matches) {
				closeNavigation();
				if (dropdownToggle) {
					dropdownToggle.blur();
				}
			}
		});
	}

	if (serviceDropdown && dropdownToggle) {
		dropdownToggle.addEventListener("click", function () {
			const isOpen = dropdownToggle.getAttribute("aria-expanded") === "true";
			setDropdownOpen(!isOpen);
		});

		serviceDropdown.addEventListener("pointerenter", function () {
			if (window.matchMedia("(min-width: 901px) and (hover: hover)").matches) {
				setDropdownOpen(true);
			}
		});

		serviceDropdown.addEventListener("pointerleave", function () {
			if (window.matchMedia("(min-width: 901px) and (hover: hover)").matches && !serviceDropdown.contains(document.activeElement)) {
				setDropdownOpen(false);
			}
		});

		serviceDropdown.addEventListener("focusout", function (event) {
			if (!serviceDropdown.contains(event.relatedTarget)) {
				setDropdownOpen(false);
			}
		});

		document.addEventListener("click", function (event) {
			if (event.target instanceof Node && !serviceDropdown.contains(event.target)) {
				setDropdownOpen(false);
			}
		});
	}

	document.addEventListener("click", function (event) {
		if (
			navigation &&
			menuToggle &&
			event.target instanceof Node &&
			!navigation.contains(event.target) &&
			!menuToggle.contains(event.target) &&
			window.matchMedia("(max-width: 900px)").matches
		) {
			closeNavigation();
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") {
			const dropdownWasOpen = dropdownToggle && dropdownToggle.getAttribute("aria-expanded") === "true";
			const navigationWasOpen = menuToggle && menuToggle.getAttribute("aria-expanded") === "true";
			closeNavigation();
			if (navigationWasOpen && menuToggle) {
				menuToggle.focus();
			} else if (dropdownWasOpen && dropdownToggle) {
				dropdownToggle.focus();
			}
		}
	});

	window.addEventListener("resize", function () {
		const isMobile = window.matchMedia("(max-width: 900px)").matches;
		if (isMobile !== isMobileNavigation) {
			isMobileNavigation = isMobile;
			closeNavigation();
		} else if (dropdownToggle && dropdownToggle.getAttribute("aria-expanded") === "true") {
			positionServiceMenu();
		}
	});

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
