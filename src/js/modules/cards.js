const Cards = (function () {
    const cardsMethods = {};
    const slider = document.querySelector("#slider");
    let videos = [];

    cardsMethods.update = function (newVideos) {
        // При дозагрузке это не сработает
        videos = newVideos;
        if (videos) {
            renderCards(videos);
        }
    }

    function renderCards(videos) {
        videos.forEach(video => renderCard(video));
    }

    function renderCard(video) {
        const {imgUrl, videoUrl, author, uploadDate, viewCount, description, title} = video;

        let cutDescription = description.slice(0, 250);
        if (cutDescription.length < description.length) {
            cutDescription += '...';
        }

        let cutTitle = title.slice(0, 100);
        if (cutTitle.length < title.length) {
            cutTitle += '...';
        }

        let date = new Date(uploadDate).toLocaleDateString();

        const cardTemplate = `
            <div class="video__header">
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

        const card = document.createElement('div');
        card.classList.add("video", "slider__item");
        card.innerHTML = cardTemplate;
        card.querySelector(".video__header").style.backgroundImage = `url(${imgUrl})`;

        slider.appendChild(card);

        return card;
    }

    return cardsMethods;
})();

export default Cards;
