import SearchService from './search-service';
import Loader from './loader';
import VideoManager from './video-manager';

const header = document.getElementById('header');
const main = document.getElementById('main');
const searchFormContentTemplate = `
		<input class="search__input" id="search__input" type="text" aria-label="search" placeholder="Search" required>
        <button class="search__button" type="submit" aria-label="search">
            <svg
			class="search__button-label"
			viewBox="0 0 24 24"
			preserveAspectRatio="xMidYMid meet"
			focusable="false"
			style="pointer-events: none; display: block; width: 100%; height: 100%;">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
        </button>`;

export class Finder {
	constructor() {
		this.searchForm = null;
	}
}

Finder.prototype.addListener = function addListener() {
	const searchInput = this.searchForm.querySelector('.search__input');

	this.searchForm.addEventListener('submit', async (event) => {
		const searchResults = await this.search(event, searchInput);
		return searchResults;
	});
};

Finder.prototype.search = async function search(event, searchInput) {
	event.preventDefault();

	const searchLoader = new Loader();
	searchLoader.show(main);

	const searchRequest = searchInput.value;
	const searchResult = await SearchService.getVideosByKeyword(searchRequest);

	VideoManager.addVideos(searchResult);

	searchLoader.remove();
};

Finder.prototype.show = function show() {
	this.searchForm = document.createElement('form');
	this.searchForm.classList.add('search');
	this.searchForm.innerHTML = searchFormContentTemplate;

	header.append(this.searchForm);

	this.addListener();
};
