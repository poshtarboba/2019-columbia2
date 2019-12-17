(function (){

	slideshow('.slideshow', '.slideshow-pager');
	zoomImage('.slideshow img');
	discountTimer();


	function slideshow(ulSlideshowSelector, divPagerSelector) {
		const DURATION = 4000;
		let slideshows = document.querySelectorAll(ulSlideshowSelector);
		slideshows.forEach(slideshow => {
			for (let i = 0; i < slideshow.children.length; i++)
				slideshow.children[i].dataset.id = i;
			let pagerSelector = divPagerSelector + `[data-for="${slideshow.getAttribute('id')}"]`;
			let pager = createPager(slideshow, document.querySelector(pagerSelector));
			slideshow.firstElementChild.classList.add('active');
			slideshow.timerId = setTimeout(nextSlide, DURATION, slideshow);
			slideshow.addEventListener('mouseenter', stop);
			slideshow.addEventListener('mouseleave', run);
		});
		function nextSlide(slideshow) {
			let activeSlide = slideshow.querySelector('.active');
			activeSlide.classList.remove('active');
			activeSlide = activeSlide.nextElementSibling || slideshow.firstElementChild;
			activeSlide.classList.add('active');
			updatePager(slideshow);
			slideshow.timerId = setTimeout(nextSlide, DURATION, slideshow);
		}
		function stop() {
			clearTimeout(this.timerId);
		}
		function run() {
			this.timerId = setTimeout(nextSlide, DURATION, this);
		}
		function createPager(slideshow, pager) {
			let html = '';
			slideshow.querySelectorAll('img').forEach(img => { html += img.outerHTML; });
			pager.innerHTML = html;
			pager.firstElementChild.classList.add('active');
			pager.querySelectorAll('img').forEach((img, i) => {
				img.addEventListener('click', () => {
					slideshow.querySelector('.active').classList.remove('active');
					slideshow.children[i].classList.add('active');
					updatePager(slideshow);
				});
			});
			pager.addEventListener('mouseenter', () => stop.call(slideshow));
			pager.addEventListener('mouseleave', () => run.call(slideshow));
			slideshow.pager = pager;
			return pager;
		}
		function updatePager(slideshow) {
			let activeSlideIndex = +slideshow.querySelector('.active').dataset.id;
			slideshow.pager.querySelector('.active').classList.remove('active');
			slideshow.pager.children[activeSlideIndex].classList.add('active');
		}
	}

	function zoomImage(imgSelector) {
		document.querySelectorAll(imgSelector).forEach(img => {
			img.addEventListener('mouseenter', showZoom);
			img.addEventListener('mousemove', moveZoom);
			img.addEventListener('mouseleave', hideZoom);
		});
		function showZoom() {
			let img = this;
			let zoomBox = document.getElementById('zoom_image_box');
			if (zoomBox) zoomBox.remove();
			if (window.innerWidth < 1200) return;
			zoomBox = document.createElement('div');
			zoomBox.setAttribute('id', 'zoom_image_box');
			document.body.appendChild(zoomBox);
			img.zoomBox = zoomBox;
			zoomBox.img = img;
			let src = img.getAttribute('src');
			let alt = img.getAttribute('alt');
			zoomBox.innerHTML = `<img src="${src}" alt="${alt}">`;
			let imgRect = img.getBoundingClientRect();
			zoomBox.style.top = window.scrollY + imgRect.top + 'px';
			zoomBox.style.width = 760 - img.clientWidth - 20 + 'px';
			zoomBox.style.height = img.clientHeight + 'px';
			zoomBox.style.left = (
				imgRect.left < window.innerWidth / 2 ?
				imgRect.right + 10 :
				imgRect.left - zoomBox.offsetWidth - 10
			) + 'px';
		}
		function moveZoom(e) {
			if (window.innerWidth < 1200) return;
			let img = this;
			if (!img.zoomBox) return;
			let fullImg = img.zoomBox.firstElementChild;
			let x = Math.min(Math.max(e.offsetX / img.clientWidth, 0), 1);
			let y = Math.min(Math.max(e.offsetY / img.clientHeight, 0), 1);
			let dw = fullImg.clientWidth - img.zoomBox.clientWidth;
			let dh = fullImg.clientHeight - img.zoomBox.clientHeight;
			fullImg.style.left = -x * dw + 'px';
			fullImg.style.top = -y * dh + 'px';
		}
		function hideZoom() {
			let img = this;
			let zoomBox = document.getElementById('zoom_image_box');
			if (zoomBox) zoomBox.remove();
			img.zoomBox = null;
		}
	}

	function discountTimer(){
		let timerH = document.querySelectorAll('.timer-h');
		let timerM = document.querySelectorAll('.timer-m');
		let timerS = document.querySelectorAll('.timer-s');
		let productLeft = document.querySelectorAll('.products-left-count');

		let now = Date.now();
		let endTime = +localStorage.getItem('ltm');
		if (endTime && now > endTime) endTime = null;
		if (!endTime) localStorage.setItem('ltm', endTime = now + rndTime());

		showTime();
		const timerId = setInterval(() => {
			now = Date.now();
			if (now >= endTime) {
				clearInterval(timerId);
				timeIsOver();
			} else showTime();
		}, 1000);
		function rndTime(){
			// задаём случайное значение 17-22 часа, 7-55 мин, 9-52 сек
			return result = ((r(17, 22) * 60 + r(7, 55)) * 60 + r(9, 52)) * 1000;
			function r(min, max) {
				return Math.floor(min + Math.random() * (max + 1 - min));
			}
		}
		function showTime(){
			let s = Math.floor((endTime - now) / 1000);
			let h = add0(Math.trunc(s / 3600));
			s %= 3600;
			let m = add0(Math.trunc(s / 60));
			s = add0(s % 60);
			timerH.forEach(span => span.innerText = h);
			timerM.forEach(span => span.innerText = m);
			timerS.forEach(span => span.innerText = s);
		}
		function add0(n) {
			return n > 9 ? n : '0' + n;
		}
	}

})();
