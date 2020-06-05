const Cards = (function () {
    const cardsMethods = {};
    const slider = document.querySelector("#slider");

    cardsMethods.update = function (videos) {
        if (videos.length > 0) {
            renderCards(videos);
        } else {
            removeCards();
        }
    }

    function renderCards(videos) {
        videos.forEach(video => renderCard(video));
    }

    function renderCard(video) {
        const card = document.createElement('div');
        card.classList.add("video", "slider__item");
        card.innerHTML = fillTemplate(video);
        card.querySelector(".video__header").style.backgroundImage = `url(${video.imgUrl})`;

        slider.appendChild(card);

        return card;
    }

    function fillTemplate(video) {
        const {videoUrl, author, uploadDate, viewCount, description, title} = video;

        let cutDescription = description.slice(0, 250);
        if (cutDescription.length < description.length) {
            cutDescription += '...';
        }

        let cutTitle = title.slice(0, 100);
        if (cutTitle.length < title.length) {
            cutTitle += '...';
        }

        let date = new Date(uploadDate).toLocaleDateString();

        return `<div class="video__header">
                    <h2 class="video__header-title">
                        <a href=${videoUrl} class="video__header-title-link">${cutTitle}</a>
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

    function removeCards() {
        const cards = slider.querySelectorAll(".video, .slider__item");
        cards.forEach(card => card.remove());
    }

    cardsMethods.moveToPage = function (videos, pageNumber) {
        const currentPageVideos = videos.filter(video => video.pageNumber === pageNumber);
        cardsMethods.update(currentPageVideos);
    }

    return cardsMethods;
})();

export default Cards;
