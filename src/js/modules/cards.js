const Cards = (function Cards() {
	const cardsMethods = {};

	function fillTemplate(video) {
		const {
			videoUrl, author, uploadDate, viewCount, description, title,
		} = video;

		let cutDescription = description.slice(0, 250);
		if (cutDescription.length < description.length) {
			cutDescription += '...';
		}

		let cutTitle = title.slice(0, 100);
		if (cutTitle.length < title.length) {
			cutTitle += '...';
		}

		const date = new Date(uploadDate).toLocaleDateString();

		return `
			<div class="video__header">
				<h2 class="video__header-title">
					<a href=${videoUrl} class="video__header-title-link" target="_blank" rel="noopener noreferrer">${cutTitle}</a>
				</h2>
			</div>
			<div class="video__info">
				<ul class="video__info-params">
					<li class="video__info-params__author">${author}</li>
					<li class="video__info-params__upload-date">${date}</li>
					<li class="video__info-params__view-count">${viewCount}</li>
				</ul>
				<p class="video__info-description">${cutDescription}</p>
			</div>`;
	}

	function renderCard(video) {
		const card = document.createElement('div');
		card.innerHTML = fillTemplate(video);
		card.querySelector('.video__header').style.backgroundImage = `url(${video.imgUrl})`;
		card.id = `video-${video.id.videoId}`;
		card.classList.add('video', 'slider__item');

		return card;
	}

	function renderCards(page, videos) {
		videos.forEach((video) => {
			const videoNode = renderCard(video);
			page.appendChild(videoNode);
		});
	}

	cardsMethods.update = (page, videos) => {
		if (!videos || videos.length <= 0) {
			throw new Error('There is no videos to render cards');
		}
		renderCards(page, videos);
	};

	return cardsMethods;
}());

export default Cards;
