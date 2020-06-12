const youtubeUrl = 'https://youtu.be/';

function mapVideosInfo(videos) {
	return videos.items.map((video) => {
		const {
			title, channelTitle: author, publishedAt: uploadDate, description, thumbnails: {high: {url: imgUrl}},
		} = video.snippet;
		const {id: videoId, statistics: {viewCount}} = video;

		return {
			title,
			author,
			uploadDate,
			description,
			imgUrl,
			id: videoId,
			videoUrl: `${youtubeUrl}${videoId}`,
			viewCount,
		};
	});
}

const SearchService = (function SearchService() {
	const apiUrl = 'https://www.googleapis.com/youtube/v3/';
	const apiKey = process.env.GOOGLE_API_KEY;
	const searchMethods = {};

	searchMethods.getVideosByKeyword = async function getVideosByKeyword(searchRequest, pageToken) {
		let videos;

		const pageTokenQuery = pageToken ? `&pageToken=${pageToken}` : '';
		const url = `${apiUrl}search?$key=${apiKey}&type=video&part=snippet&maxResults=15&q=${searchRequest}${pageTokenQuery}`;

		const response = await fetch(url);

		if (response.ok) {
			videos = await response.json();
		} else {
			throw new Error(`HTTP Error in getVideosByKeyword: ${response.status}`);
		}

		const videosWithStats = await searchMethods.getVideosStats(videos.items);

		return {
			nextPageToken: videos.nextPageToken,
			keyword: searchRequest,
			items: mapVideosInfo(videosWithStats),
		};
	};

	searchMethods.getVideoStatsById = async function getVideoStatsById(videoId) {
		const url = `${apiUrl}videos?$key=${apiKey}&id=${videoId}&part=snippet,statistics`;
		const response = await fetch(url);
		let videoStats;

		if (response.ok) {
			videoStats = await response.json();
		} else {
			throw new Error(`HTTP Error in getVideoStatsById: ${response.status}`);
		}

		return videoStats;
	};

	searchMethods.getVideosStats = async function getVideosStats(videos) {
		const videoIds = videos.map((video) => video.id.videoId);
		const videoStats = await searchMethods.getVideoStatsById(videoIds);
		return videoStats;
	};

	return searchMethods;
}());

export default SearchService;
