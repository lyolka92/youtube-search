const spinnerClass = 'spinner';

export class Spinner {
	constructor(parentNode) {
		this.loader = null;
		this.parentNode = parentNode;
		this.render();
	}

	render() {
		this.loader = document.createElement('div');
		this.loader.classList.add(spinnerClass);
		this.parentNode.prepend(this.loader);
	}

	remove() {
		if (!this.loader) {
			return;
		}
		this.loader.remove();
	}
}
