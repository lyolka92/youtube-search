import Cards from "./cards";

const VideoManager = (function () {
    const videoManagerMethods = {};

    let videos = [];
    let searchParams = {
        nextPageToken: null,
        keyword: '',
    };

    videoManagerMethods.addVideos = function (searchResult) {
        if (videos.length > 0 && searchParams.keyword !== searchResult.keyword) {
            videoManagerMethods.removeVideos();
        }

        videos.push(...searchResult.items);
        searchParams.nextPageToken = searchResult.nextPageToken;
        searchParams.keyword = searchResult.keyword;

        Cards.update(videos);

        console.log(searchParams);
    }

    videoManagerMethods.removeVideos = function () {
        if (!videos) {
            throw new Error("There is no videos to remove");
        }

        videos = [];
        searchParams = {};

        Cards.update(videos);
    }

    return videoManagerMethods;
})();

export default VideoManager;