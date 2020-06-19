import {goToPage} from '../video-manager/video-manager';
import {PagingControl} from './slider_paging-control';
import {updateCards} from './slider_cards';

export class Slider {
	constructor(parentNode) {
		this.sliderParams = {
			prevPageNumber: null,
			currentPageNumber: null,
			nexPageNumber: null,
			pagesCount: 0,
			currentPages: [],
			pages: [],
		};
		this.parentNode = parentNode;
		this.node = null;
		this.pagesNode = null;
		this.pagingControls = null;
		this.initialCoordinate = null;
		this.render();
	}

	render() {
		this.node = document.createElement('div');
		this.node.classList.add('slider');

		this.pagesNode = document.createElement('div');
		this.pagesNode.classList.add('slider__pages');

		this.parentNode.appendChild(this.node);
		this.node.appendChild(this.pagesNode);
		this.pagingControls = new PagingControl(this.node, changeActivePage);
		this.addEventListeners();
	}

	removeAllPages() {
		this.sliderParams.pages.forEach((page) => {
			page.pageNode.remove();
		});

		this.sliderParams.prevPageNumber = null;
		this.sliderParams.currentPageNumber = null;
		this.sliderParams.nextPageNumber = null;
		this.sliderParams.pages = [];
	}

	moveToPage(videos, pagesCount, currentPageNumber) {
		this.sliderParams.prevPageNumber = currentPageNumber - 1 === 0 ? null : currentPageNumber - 1;
		this.sliderParams.currentPageNumber = currentPageNumber;
		this.sliderParams.nextPageNumber = currentPageNumber + 1 > pagesCount ? null : currentPageNumber + 1;
		this.sliderParams.pagesCount = pagesCount;
		this.sliderParams.currentPages = [];

		if (this.sliderParams.prevPageNumber) {
			this.updatePage(videos, this.sliderParams.prevPageNumber, true);
		}

		this.updatePage(videos, currentPageNumber, false);

		if (this.sliderParams.nextPageNumber) {
			this.updatePage(videos, this.sliderParams.nextPageNumber, true);
		}

		this.removeOldPages();

		const pageNumbers = this.sliderParams.pages.map((page) => page.pageNumber);
		this.pagingControls.update(pageNumbers, this.sliderParams.currentPageNumber);
	}

	updatePage(videos, pageNumber, isHidden) {
		const existingPageInfo = this.sliderParams.pages.find((page) => page.pageNumber === pageNumber);

		if (existingPageInfo) {
			const existingPageIsHidden = existingPageInfo.pageNode.classList.contains('page__hidden');
			if (existingPageIsHidden && !isHidden) {
				existingPageInfo.pageNode.classList.remove('page__hidden');
			} else if (!existingPageIsHidden && isHidden) {
				existingPageInfo.pageNode.classList.add('page__hidden');
			}
			this.updateAnimationClasses(existingPageInfo);
			this.sliderParams.currentPages.push(existingPageInfo);
		} else {
			const pageVideos = videos.filter((video) => video.pageNumber === pageNumber);
			const pageInfo = this.addPageInfo(pageNumber, pageVideos, isHidden);
			this.renderPage(pageInfo);
			this.updateAnimationClasses(pageInfo);
			this.sliderParams.currentPages.push(pageInfo);
		}
	}

	addPageInfo(pageNumber, pageVideos, isHidden) {
		const pageInfo = {
			pageNumber,
			pageVideos,
			isHidden,
		};

		const existingPageInfo = this.sliderParams.pages.find((page) => page.pageNumber === pageInfo.pageNumber);

		if (existingPageInfo) {
			existingPageInfo.isHidden = pageInfo.isHidden;
		} else {
			this.sliderParams.pages.push(pageInfo);
		}

		return pageInfo;
	}

	renderPage(pageInfo) {
		const page = document.createElement('div');
		page.id = `page-${pageInfo.pageNumber}`;
		page.classList.add('page');
		if (pageInfo.isHidden) {
			page.classList.add('page__hidden');
		}

		pageInfo.pageNode = page;

		const pageNumbers = this.sliderParams.pages.map((p) => p.pageNumber);
		const maxPageNumber = Math.max.apply(null, pageNumbers);

		if (pageInfo.pageNumber >= maxPageNumber) {
			this.pagesNode.appendChild(page);
		} else {
			this.pagesNode.prepend(page);
		}

		updateCards(page, pageInfo.pageVideos);
	}

	updateAnimationClasses(pageInfo) {
		const {pageNode} = pageInfo;
		const pageNodeIsPrev = pageNode.classList.contains('page__prev');
		const pageNodeIsNext = pageNode.classList.contains('page__next');

		if (pageNodeIsPrev && pageInfo.pageNumber !== this.sliderParams.prevPageNumber) {
			pageNode.classList.remove('page__prev');
		}

		if (pageNodeIsNext && pageInfo.pageNumber !== this.sliderParams.nextPageNumber) {
			pageNode.classList.remove('page__next');
		}

		if (pageInfo.pageNumber === this.sliderParams.prevPageNumber) {
			pageNode.classList.add('page__prev');
		} else if (pageInfo.pageNumber === this.sliderParams.nextPageNumber) {
			pageNode.classList.add('page__next');
		}
	}

	removeOldPages() {
		const pageNumbers = this.sliderParams.pages.map((page) => page.pageNumber);
		const currentPageNumbers = this.sliderParams.currentPages.map((page) => page.pageNumber);

		const oldPageNumbers = pageNumbers.filter((pageNumber) => !currentPageNumbers.includes(pageNumber));

		if (oldPageNumbers.length > 0) {
			oldPageNumbers.forEach((pageNumber) => {
				const pageToRemove = this.sliderParams.pages.find((page) => page.pageNumber === pageNumber);
				pageToRemove.pageNode.remove();

				const pageIndex = pageNumbers.indexOf(pageNumber);
				this.sliderParams.pages.splice(pageIndex, 1);
			});
		}
	}

	addEventListeners() {
		this.pagesNode.addEventListener('mousedown', (event) => lock.call(this, event), false);
		this.pagesNode.addEventListener('touchstart', (event) => lock.call(this, event), false);

		this.pagesNode.addEventListener('mouseup', (event) => move.call(this, event), false);
		this.pagesNode.addEventListener('touchend', (event) => move.call(this, event), false);

		function lock(event) {
			const unifiedEvent = event.changedTouches ? event.changedTouches[0] : event;
			this.initialCoordinate = unifiedEvent.clientX;
		}

		async function move(event) {
			if (this.initialCoordinate || this.initialCoordinate === 0) {
				const unifiedEvent = event.changedTouches ? event.changedTouches[0] : event;
				const distance = unifiedEvent.clientX - this.initialCoordinate;
				const direction = Math.sign(distance);

				if ((this.sliderParams.currentPageNumber > 0 || direction < 0)
					&& (this.sliderParams.currentPageNumber < this.sliderParams.pagesCount || direction > 0)) {
					const newActivePageNumber = this.sliderParams.currentPageNumber - direction;
					await changeActivePage(newActivePageNumber);
				}

				this.initialCoordinate = null;
			}
		}
	}
}

async function changeActivePage(newActivePageNumber) {
	await goToPage(newActivePageNumber);
}
