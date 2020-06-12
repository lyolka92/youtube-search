import VideoManager from './video-manager';

const PagingControls = (function PagingControls() {
	const main = document.querySelector('#main');

	function addClassToActivePageControl(pageNumber) {
		const activePagingControlId = `paging-control-${pageNumber}`;
		const activePagingControlNode = this.navNode.querySelector(`#${activePagingControlId}`);
		activePagingControlNode.classList.add('paging-controls__item__active');
	}

	function removeClassFromActivePageControl() {
		const activePagingControlId = `paging-control-${this.activePageNumber}`;
		const activePagingControlNode = this.navNode.querySelector(`#${activePagingControlId}`);
		activePagingControlNode.classList.remove('paging-controls__item__active');
	}

	async function goToPage(event, pageNumber) {
		event.preventDefault();
		await VideoManager.goToPage(pageNumber);
	}

	function addPageControls(pageControls) {
		pageControls.forEach((pageControlNumber) => {
			const pageControlId = `paging-control-${pageControlNumber}`;
			const relatedPageHref = `#page-${pageControlNumber}`;

			const pageControlNode = document.createElement('a');
			pageControlNode.classList.add('paging-controls__item');
			pageControlNode.id = pageControlId;
			pageControlNode.href = relatedPageHref;
			pageControlNode.innerHTML = pageControlNumber;
			pageControlNode.addEventListener('click', () => goToPage(event, pageControlNumber));

			const maxPageNumber = Math.max(...this.pageNumbers);
			if (pageControlNumber >= maxPageNumber) {
				this.navNode.appendChild(pageControlNode);
			} else {
				this.navNode.prepend(pageControlNode);
			}
		});
	}

	function removePageControls(pageControls) {
		pageControls.forEach((pageControlNumber) => {
			const pageControlId = `paging-control-${pageControlNumber}`;
			const pageControlNode = this.navNode.querySelector(`#${pageControlId}`);
			pageControlNode.remove();
		});
	}

	function PagingController() {
		this.pageNumbers = [];
		this.activePageNumber = 0;
		this.navNode = null;
	}

	PagingController.prototype.show = function show() {
		const navNode = document.createElement('nav');
		navNode.classList.add('paging-controls');
		main.appendChild(navNode);

		this.navNode = navNode;
	};

	PagingController.prototype.update = function update(newPageNumbers, newActivePageNumber) {
		if (this.pageNumbers.length > 0) {
			const boundRemoveClassFromActivePageControl = removeClassFromActivePageControl.bind(this);
			boundRemoveClassFromActivePageControl();

			const pageControlsToRemove = this.pageNumbers.filter((pageNumber) => !newPageNumbers.includes(pageNumber));
			const boundRemovePageControls = removePageControls.bind(this);
			boundRemovePageControls(pageControlsToRemove);
		}

		const pageControlsToAdd = this.pageNumbers.length > 0
			? newPageNumbers.filter((pageNumber) => !this.pageNumbers.includes(pageNumber))
			: newPageNumbers;
		const boundAddPageControls = addPageControls.bind(this);
		boundAddPageControls(pageControlsToAdd);

		const boundAddClassToActivePageControl = addClassToActivePageControl.bind(this);
		boundAddClassToActivePageControl(newActivePageNumber);

		this.pageNumbers = newPageNumbers;
		this.activePageNumber = newActivePageNumber;
	};

	PagingController.prototype.remove = function remove() {
		this.pageNumbers = [];
		this.activePageNumber = 0;
		this.navNode.remove();
		this.navNode = null;
	};

	return PagingController;
}());

export default PagingControls;
