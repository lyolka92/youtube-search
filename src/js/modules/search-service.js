const youtubeUrl = 'https://youtu.be/';

const SearchService = (function() {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/';
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchMethods = {};

    searchMethods.getVideosByKeyword = async function(searchRequest) {
        const url = `${apiUrl}search?$key=${apiKey}&type=video&part=snippet&maxResults=15&q=${searchRequest}`;
        const response = await fetch(url);

        if (response.ok) {
            var videos = await response.json();
        } else {
            alert("HTTP Error in getVideosByKeyword: " + response.status);
        }

        const videosWithStats = await searchMethods.getVideosStats(videos.items);

        return mapVideosInfo(videosWithStats);
    }

    searchMethods.getVideoStatsById = async function (videoId) {
        const url = `${apiUrl}videos?$key=${apiKey}&id=${videoId}&part=snippet,statistics`;
        const response = await fetch(url);

        if (response.ok) {
            var videoStats = await response.json();
        } else {
            alert("HTTP Error in getVideoStatsById: " + response.status);
        }

        return videoStats;
    }

    searchMethods.getVideosStats = async function(videos) {
        const videoIds = videos.map(video => video.id.videoId);
        return await SearchService.getVideoStatsById(videoIds);
    }

    return searchMethods;
})();

function mapVideosInfo(videos) {
    return videos.items.map(video => {
        return {
            title: video.snippet.title,
            url: `${youtubeUrl}${video.id}`,
            img: video.snippet.thumbnails.high.url,
            author: video.snippet.channelTitle,
            uploadDate: video.snippet.publishedAt,
            description: video.snippet.description,
            viewCount: video.statistics.viewCount
        }
    });
}

export default SearchService;

