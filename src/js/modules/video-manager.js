import Slider from "./slider";
import SearchService from "./search-service";

const VideoManager = (function () {
    const videoManagerMethods = {};

    let videos = [];
    let videosInfo = {
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
        if (videos.length > 0 && videosInfo.searchParams.keyword !== searchResult.keyword) {
            const tempSearchResult = Object.assign({}, searchResult);
            videoManagerMethods.removeVideos();
            videoManagerMethods.addVideos(tempSearchResult);
        } else {
            videos.push(...searchResult.items);
            videosInfo.searchParams.nextPageToken = searchResult.nextPageToken;
            videosInfo.searchParams.keyword = searchResult.keyword;
            videosInfo.pagination.currentPage = 1;
            addPagesInfo(videos);

            Slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
        }
    }

    videoManagerMethods.removeVideos = function () {
        if (!videos) {
            throw new Error("There is no videos to remove");
        }

        videos = [];
        videosInfo.searchParams = {};
        videosInfo.pagination = {};

        Slider.removeAllPages();
    }

    videoManagerMethods.getMoreVideos = async function (keyword, pageToken) {
        const newVideos = await SearchService.getVideosByKeyword(keyword, pageToken);

        videosInfo.searchParams.nextPageToken = newVideos.nextPageToken;
        videos.push(...newVideos.items);
        addPagesInfo(videos);
    }

    videoManagerMethods.moveNext = async function () {
        if (videosInfo.pagination.currentPage > videosInfo.pagination.pagesCount) {
            throw new Error("This is the last page");
        }

        if (videosInfo.pagination.currentPage >= videosInfo.pagination.pagesCount - 2) {
            await videoManagerMethods.getMoreVideos(videosInfo.searchParams.keyword, videosInfo.searchParams.nextPageToken);
        }

        Slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
    }

    videoManagerMethods.movePrev = function () {
        if (videosInfo.pagination.currentPage < 1) {
            throw new Error("This is the first page");
        }

        Slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
    }

    videoManagerMethods.goToPage = async function (page) {
        const oldPage = videosInfo.pagination.currentPage;
        videosInfo.pagination.currentPage = page;

        if (page > oldPage) {
            await videoManagerMethods.moveNext();
        } else if (page < oldPage) {
            videoManagerMethods.movePrev();
        }
    }

    function addPagesInfo(videos) {
        const videosCount = videos.length;
        const screenWidth = window.screen.width;

        switch (true) {
            case screenWidth >= 1280:
                videosInfo.pagination.videosPerPage = 4;
                break;
            case screenWidth >= 910:
                videosInfo.pagination.videosPerPage = 3;
                break;
            case screenWidth >= 610:
                videosInfo.pagination.videosPerPage = 2;
                break;
            default:
                videosInfo.pagination.videosPerPage = 1;
                break;
        }

        videosInfo.pagination.pagesCount = Math.ceil(videosCount / videosInfo.pagination.videosPerPage);

        videos.forEach((video, index) => {
            video.pageNumber = Math.floor((index + videosInfo.pagination.videosPerPage) / videosInfo.pagination.videosPerPage);
        })
    }

    return videoManagerMethods;
})();

export default VideoManager;