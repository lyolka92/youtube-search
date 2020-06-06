const youtubeUrl = 'https://youtu.be/';

const SearchService = (function() {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/';
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchMethods = {};

    searchMethods.getVideosByKeyword = async function (searchRequest, pageToken) {
        let videos;

        const pageTokenQueryParam = pageToken ? `&pageToken=${pageToken}` : '';
        const url = `${apiUrl}search?$key=${apiKey}&type=video&part=snippet&maxResults=15&q=${searchRequest}${pageTokenQueryParam}`;

        const response = await fetch(url);

        if (response.ok) {
            videos = await response.json();
        } else {
            alert("HTTP Error in getVideosByKeyword: " + response.status);
        }

        const videosWithStats = await searchMethods.getVideosStats(videos.items);

        return {
            nextPageToken: videos.nextPageToken,
            keyword: searchRequest,
            items: mapVideosInfo(videosWithStats),
        };
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
        const {title, channelTitle: author, publishedAt: uploadDate, description, thumbnails : {high : {url : imgUrl}}} = video.snippet;
        const {id : videoId, statistics : { viewCount }} = video;

        return {
            title: title,
            author: author,
            uploadDate: uploadDate,
            description: description,
            imgUrl: imgUrl,
            id: videoId,
            videoUrl: `${youtubeUrl}${videoId}`,
            viewCount: viewCount
        }
    });
}

export default SearchService;

