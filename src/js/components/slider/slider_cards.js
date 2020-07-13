function getCardTemplateLayout(video) {
	const {
		videoUrl, author, uploadDate, viewCount, description, title,
	} = video;

	const DESCRIPTION_LIMIT = 250;
	const TITLE_LIMIT = 100;

	let cutDescription = description.slice(0, DESCRIPTION_LIMIT);
	if (cutDescription.length < description.length) {
		cutDescription += '...';
	}

	let cutTitle = title.slice(0, TITLE_LIMIT);
	if (cutTitle.length < title.length) {
		cutTitle += '...';
	}

	const date = new Date(uploadDate).toLocaleDateString();

	return `
		<div class="video__header" style="background-image: url(${video.imgUrl})">
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

function getCardNode(video) {
	const cardNode = document.createElement('div');
	cardNode.innerHTML = getCardTemplateLayout(video);
	cardNode.id = `video-${video.id}`;
	cardNode.classList.add('video', 'slider__item');

	return cardNode;
}

function renderCards(page, videos) {
	videos.forEach((video) => {
		const videoNode = getCardNode(video);
		page.appendChild(videoNode);
	});
}

export function updateCards(page, videos) {
	if (videos && videos instanceof Array && videos.length > 0) {
		renderCards(page, videos);
	}
}
