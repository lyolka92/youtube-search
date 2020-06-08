import Cards from "./cards";
import VideoManager from "./video-manager";
import PagingControls from "./paging-controls";

const Slider = (function () {
    const sliderMethods = {};
    const slider = document.querySelector("#slider");
    const sliderParams = {
        prevPageNumber: null,
        currentPageNumber: null,
        nexPageNumber: null,
        pagesCount: 0,
        currentPages: [],
        pages: [],
        pagingControls: null
    }

    sliderMethods.moveToPage = function (videos, pagesCount, currentPageNumber) {
        sliderParams.prevPageNumber = currentPageNumber - 1 === 0 ? null : currentPageNumber - 1;
        sliderParams.currentPageNumber = currentPageNumber;
        sliderParams.nextPageNumber = currentPageNumber + 1 > pagesCount ? null : currentPageNumber + 1;
        sliderParams.pagesCount = pagesCount;
        sliderParams.currentPages = [];

        if (sliderParams.prevPageNumber) {
            const prevPageVideos = getPageVideos(videos, sliderParams.prevPageNumber);
            const pageInfo = addPageInfo(sliderParams.prevPageNumber, prevPageVideos, true);
            sliderMethods.updatePage(pageInfo);
        }

        const currentPageVideos = getPageVideos(videos, sliderParams.currentPageNumber);
        const pageInfo = addPageInfo(sliderParams.currentPageNumber, currentPageVideos, false);
        sliderMethods.updatePage(pageInfo);

        if (sliderParams.nextPageNumber) {
            const nextPageVideos = getPageVideos(videos, sliderParams.nextPageNumber);
            const pageInfo = addPageInfo(sliderParams.nextPageNumber, nextPageVideos, true);
            sliderMethods.updatePage(pageInfo);
        }

        removeOldPages();

        if (!sliderParams.pagingControls) {
            sliderParams.pagingControls = new PagingControls;
            sliderParams.pagingControls.show();
        }

        const pageNumbers = sliderParams.pages.map(page => page.pageNumber);
        sliderParams.pagingControls.update(pageNumbers, sliderParams.currentPageNumber);
    }

    sliderMethods.updatePage = function (pageInfo) {
        const pageId = `page-${pageInfo.pageNumber}`;
        const existingPageNode = slider.querySelector(`#${pageId}`);

        if (existingPageNode) {
            const existingPageIsHidden = existingPageNode.classList.contains("page__hidden");
            if (existingPageIsHidden && !pageInfo.isHidden) {
                existingPageNode.classList.remove("page__hidden");
            } else if (!existingPageIsHidden && pageInfo.isHidden) {
                existingPageNode.classList.add("page__hidden");
            }
        } else {
            sliderMethods.renderPage(pageInfo);
        }

        updateAnimationClasses(pageInfo);
    }

    sliderMethods.renderPage = function (pageInfo) {
        const page = document.createElement('div');
        page.id = `page-${pageInfo.pageNumber}`;
        page.classList.add("page");
        if (pageInfo.isHidden) {
            page.classList.add("page__hidden");
        }

        const pageNumbers = sliderParams.pages.map(page => page.pageNumber);
        const maxPageNumber = Math.max.apply(null, pageNumbers);

        if (pageInfo.pageNumber >= maxPageNumber) {
            slider.appendChild(page);
        } else {
            slider.prepend(page);
        }

        Cards.update(page, pageInfo.pageVideos);
    }

    sliderMethods.removeAllPages = function () {
        sliderParams.pages.forEach(page => {
            const pageId = `page-${page.pageNumber}`;
            const pageNode = slider.querySelector(`#${pageId}`);
            pageNode.remove();
        });

        sliderParams.prevPageNumber = null;
        sliderParams.currentPageNumber = null;
        sliderParams.nextPageNumber = null;
        sliderParams.pages = [];
        sliderParams.pagingControls.remove();
        sliderParams.pagingControls = null;
    }

    function getPageVideos(videos, pageNumber) {
        return videos.filter(video => video.pageNumber === pageNumber);
    }

    function addPageInfo(pageNumber, pageVideos, isHidden) {
        const pageInfo = {
            pageNumber: pageNumber,
            pageVideos: pageVideos,
            isHidden: isHidden
        }

        const existingPageInfo = sliderParams.pages.find(page => page.pageNumber === pageInfo.pageNumber);

        if (existingPageInfo) {
            existingPageInfo.isHidden = pageInfo.isHidden;
        } else {
            sliderParams.pages.push(pageInfo);
        }

        sliderParams.currentPages.push(pageInfo);

        return pageInfo;
    }

    function removeOldPages() {
        const pageNumbers = sliderParams.pages.map(page => page.pageNumber);
        const currentPageNumbers = sliderParams.currentPages.map(page => page.pageNumber);

        const oldPageNumbers = pageNumbers.filter(pageNumber => !currentPageNumbers.includes(pageNumber));

        if (oldPageNumbers.length > 0) {
            oldPageNumbers.forEach(pageNumber => {
                const pageIndex = pageNumbers.indexOf(pageNumber);
                sliderParams.pages.splice(pageIndex, 1);

                const pageId = `page-${pageNumber}`;
                const pageNode = slider.querySelector(`#${pageId}`);
                pageNode.remove();
            });
        }
    }

    function updateAnimationClasses(pageInfo) {
        const pageNode = slider.querySelector(`#page-${pageInfo.pageNumber}`);
        const pageNodeIsPrev = pageNode.classList.contains("page__prev");
        const pageNodeIsNext = pageNode.classList.contains("page__next");

        if (pageNodeIsPrev && pageInfo.pageNumber !== sliderParams.prevPageNumber) {
            pageNode.classList.remove("page__prev");
        }

        if (pageNodeIsNext && pageInfo.pageNumber !== sliderParams.nextPageNumber) {
            pageNode.classList.remove("page__next");
        }

        if (pageInfo.pageNumber === sliderParams.prevPageNumber) {
            pageNode.classList.add("page__prev");
        } else if (pageInfo.pageNumber === sliderParams.nextPageNumber) {
            pageNode.classList.add("page__next");
        }
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
        initialCoordinate = unify(event).clientX;
    }

    function move(event) {
        if (initialCoordinate || initialCoordinate === 0) {
            let distance = unify(event).clientX - initialCoordinate;
            let direction = Math.sign(distance);

            if ((sliderParams.currentPageNumber > 0 || direction < 0)
                && (sliderParams.currentPageNumber < sliderParams.pagesCount || direction > 0))
                VideoManager.goToPage(sliderParams.currentPageNumber - direction);

            initialCoordinate = null
        }
    }

    return sliderMethods;
})()

export default Slider;