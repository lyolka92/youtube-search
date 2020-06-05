import Cards from "./cards";
import VideoManager from "./video-manager";

const Slider = (function () {
    const sliderMethods = {};
    const slider = document.querySelector("#slider");
    const sliderParams = {
        currentPageNumber: 0,
        pagesCount: 0,
    }

    sliderMethods.moveToPage = function (videos, pagesCount, currentPageNumber) {
        sliderParams.currentPageNumber = currentPageNumber;
        sliderParams.pagesCount = pagesCount;

        const videosToRender = [];

        const prevPageNumber = currentPageNumber - 1 === 0 ? null : currentPageNumber - 1;
        if (prevPageNumber) {
            var prevPageVideos = videos.filter(video => video.pageNumber === prevPageNumber);
            prevPageVideos.forEach(video => video.hidden = true);
            videosToRender.push(...prevPageVideos);
        }

        const currentPageVideos = videos.filter(video => video.pageNumber === currentPageNumber);
        currentPageVideos.forEach(video => video.hidden = false);
        videosToRender.push(...currentPageVideos);

        const nextPageNumber = currentPageNumber + 1 > pagesCount ? null : currentPageNumber + 1;
        if (nextPageNumber) {
            var nextPageVideos = videos.filter(video => video.pageNumber === nextPageNumber);
            nextPageVideos.forEach(video => video.hidden = true);
            videosToRender.push(...nextPageVideos);
        }

        Cards.update(videosToRender);
    }

    slider.addEventListener('mousedown', lock, false);
    slider.addEventListener('touchstart', lock, false);

    slider.addEventListener('mouseup', move, false);
    slider.addEventListener('touchend', move, false);

    function unify(event) {
        return event.changedTouches ? event.changedTouches[0] : event
    }

    let initialCoordinate = null;

    function lock(event) {
        initialCoordinate = unify(event).clientX
    }

    function move(event) {
        if (initialCoordinate || initialCoordinate === 0) {
            let distance = unify(event).clientX - initialCoordinate;
            let direction = Math.sign(distance);

            if ((sliderParams.currentPageNumber > 0 || direction < 0)
                && (sliderParams.currentPageNumber < sliderParams.pagesCount || direction > 0))
                VideoManager.updatePage(sliderParams.currentPageNumber - direction);

            initialCoordinate = null
        }
    }

    return sliderMethods;
})()

export default Slider;