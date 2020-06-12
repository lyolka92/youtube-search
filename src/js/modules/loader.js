const Loader = (function Loader() {
	const loaderClass = 'loader';

	function Spinner() {
		this.loader = null;
	}

	Spinner.prototype.show = function show(parentElement) {
		this.loader = document.createElement('div');
		this.loader.classList.add(loaderClass);
		parentElement.prepend(this.loader);
	};

	Spinner.prototype.remove = function remove() {
		if (!this.loader) {
			return;
		}
		this.loader.remove();
	};

	return Spinner;
}());

export default Loader;
