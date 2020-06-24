import {Spinner} from '../spinner/spinner';
import {getNewVideos} from '../video-manager/video-manager';

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
	constructor(parentNode) {
		this.searchForm = null;
		this.parentNode = parentNode;
		this.render();
	}

	render() {
		this.searchForm = document.createElement('form');
		this.searchForm.classList.add('search');
		this.searchForm.innerHTML = searchFormContentTemplate;

		this.parentNode.append(this.searchForm);

		this.addListener();
	}

	addListener() {
		const searchInput = this.searchForm.querySelector('.search__input');

		this.searchForm.addEventListener('input', async event => {
			if (searchInput.value.length <= 3) {
				return;
			}

			await this.search(event, searchInput.value);
		});

		this.searchForm.addEventListener('submit', async (event) => {
			await this.search(event, searchInput.value);
		});
	}

	async search(event, searchRequest) {
		event.preventDefault();

		const main = document.getElementById('main');
		const searchSpinner = new Spinner(main);

		await getNewVideos(searchRequest);

		searchSpinner.remove();
	}
}
