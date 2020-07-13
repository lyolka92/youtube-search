export class PagingControls {
	constructor(parentNode, goToPageCallback) {
		this.pageNumbers = [];
		this.activePageNumber = 0;
		this.parentNode = parentNode;
		this.navNode = null;
		this.goToPageCallback = goToPageCallback;
		this.show();
	}

	show() {
		const navNode = document.createElement('nav');
		navNode.classList.add('paging-controls');
		this.parentNode.appendChild(navNode);

		this.navNode = navNode;
	}

	update(newPageNumbers, newActivePageNumber) {
		if (this.pageNumbers.length > 0) {
			this.removeClassFromActivePageControl();

			const pageControlsToRemove = this.pageNumbers.filter((pageNumber) => !newPageNumbers.includes(pageNumber));
			this.removePageControls(pageControlsToRemove);
		}

		const pageControlsToAdd = this.pageNumbers.length > 0
			? newPageNumbers.filter((pageNumber) => !this.pageNumbers.includes(pageNumber))
			: newPageNumbers;
		this.addPageControls(pageControlsToAdd);

		this.addClassToActivePageControl(newActivePageNumber);

		this.pageNumbers = newPageNumbers;
		this.activePageNumber = newActivePageNumber;
	}

	addClassToActivePageControl(pageNumber) {
		const activePagingControlNode = document.getElementById(`paging-control-${pageNumber}`);
		activePagingControlNode.classList.add('paging-controls__item__active');
	}

	removeClassFromActivePageControl() {
		const activePagingControlNode = document.getElementById(`paging-control-${this.activePageNumber}`);
		activePagingControlNode.classList.remove('paging-controls__item__active');
	}

	addPageControls(pageControls) {
		pageControls.forEach((pageControlNumber) => {
			const pageControlId = `paging-control-${pageControlNumber}`;
			const relatedPageHref = `#page-${pageControlNumber}`;

			const pageControlNode = document.createElement('a');
			pageControlNode.classList.add('paging-controls__item');
			pageControlNode.id = pageControlId;
			pageControlNode.href = relatedPageHref;
			pageControlNode.innerHTML = pageControlNumber;
			pageControlNode.addEventListener('click', (event) => {
				event.preventDefault();
				this.goToPageCallback(pageControlNumber);
			});

			const maxPageNumber = Math.max(...this.pageNumbers);
			if (pageControlNumber >= maxPageNumber) {
				this.navNode.appendChild(pageControlNode);
			} else {
				this.navNode.prepend(pageControlNode);
			}
		});
	}

	removePageControls(pageControls) {
		pageControls.forEach((pageControlNumber) => {
			const pageControlNode = document.getElementById(`paging-control-${pageControlNumber}`);
			pageControlNode.remove();
		});
	}

	remove() {
		this.pageNumbers = [];
		this.activePageNumber = 0;
		this.navNode.remove();
	}
}
