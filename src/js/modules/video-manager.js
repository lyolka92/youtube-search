import Cards from "./cards";

const VideoManager = (function () {
    const videoManagerMethods = {};

    let videos = [];
    let sliderParams = {
        searchParams: {
            nextPageToken: null,
            keyword: '',
        },
        pagination: {
            pagesCount: 0,
            videosPerPage: 0,
            currentPage: 1,
        }
    };

    videoManagerMethods.addVideos = function (searchResult) {
        if (videos.length > 0 && sliderParams.searchParams.keyword !== searchResult.keyword) {
            videoManagerMethods.removeVideos();
        }

        videos.push(...searchResult.items);
        sliderParams.searchParams.nextPageToken = searchResult.nextPageToken;
        sliderParams.searchParams.keyword = searchResult.keyword;
        addPagesInfo(videos);

        Cards.moveToPage(videos, sliderParams.pagination.currentPage);
    }

    videoManagerMethods.removeVideos = function () {
        if (!videos) {
            throw new Error("There is no videos to remove");
        }

        videos = [];
        sliderParams.searchParams = {};

        Cards.update(videos);
    }

    function addPagesInfo(videos) {
        const videosCount = videos.length;
        const screenWidth = window.screen.width;

        switch (true) {
            case screenWidth >= 1280:
                sliderParams.pagination.videosPerPage = 4;
                break;
            case screenWidth >= 910:
                sliderParams.pagination.videosPerPage = 3;
                break;
            case screenWidth >= 610:
                sliderParams.pagination.videosPerPage = 2;
                break;
            default:
                sliderParams.pagination.videosPerPage = 1;
                break;
        }

        sliderParams.pagination.pagesCount = Math.ceil(videosCount / sliderParams.pagination.videosPerPage);

        videos.forEach((video, index) => {
            video.pageNumber = Math.floor((index + sliderParams.pagination.videosPerPage) / sliderParams.pagination.videosPerPage);
        })
    }

    return videoManagerMethods;
})();

export default VideoManager;