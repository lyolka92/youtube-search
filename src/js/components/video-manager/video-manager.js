import {Slider} from '../slider/slider';
import {getVideosByKeyword} from '../../api/search-service';

let videos = [];
const videosInfo = {
	searchParams: {
		nextPageToken: null,
		keyword: '',
	},
	pagination: {
		pagesCount: 0,
		videosPerPage: 0,
		currentPage: 1,
	},
};

const main = document.getElementById('main');
const slider = new Slider(main);

export async function getNewVideos(searchRequest) {
	const searchResult = await getVideosByKeyword(searchRequest);

	if (videos.length > 0) {
		removeVideos();
	}

	videosInfo.searchParams.keyword = searchResult.keyword;
	videosInfo.pagination.currentPage = 1;
	addVideos(searchResult);

	console.log(videos);

	slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
}

async function getMoreVideos(keyword, pageToken) {
	const searchResult = await getVideosByKeyword(keyword, pageToken);
	addVideos(searchResult);
}

function addVideos(searchResult) {
	videos.push(...searchResult.items);
	videosInfo.searchParams.nextPageToken = searchResult.nextPageToken;

	addPagesInfo();
}

function removeVideos() {
	if (!videos) {
		console.log('There is no videos to remove');
	}

	videos = [];
	videosInfo.searchParams = {};
	videosInfo.pagination = {};

	slider.removeAllPages();
}

export async function goToPage(pageNumber) {
	const oldPageNumber = videosInfo.pagination.currentPage;
	videosInfo.pagination.currentPage = pageNumber;

	if (pageNumber > oldPageNumber) {
		await moveNext();
	} else if (pageNumber < oldPageNumber) {
		movePrev();
	}
}

async function moveNext() {
	if (videosInfo.pagination.currentPage > videosInfo.pagination.pagesCount) {
		console.log('This is the last page');
	}

	if (videosInfo.pagination.currentPage >= videosInfo.pagination.pagesCount - 2) {
		await getMoreVideos(videosInfo.searchParams.keyword, videosInfo.searchParams.nextPageToken);
	}

	slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
}

function movePrev() {
	if (videosInfo.pagination.currentPage < 1) {
		console.log('This is the first page');
	}

	slider.moveToPage(videos, videosInfo.pagination.pagesCount, videosInfo.pagination.currentPage);
}

function addPagesInfo() {
	const videosCount = videos.length;
	const screenWidth = window.innerWidth;

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
	});
}
