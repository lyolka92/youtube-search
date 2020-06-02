const Loader = (function() {
    const loaderClass = "loader";

    function Loader () {
        this.loader = null;
    }

    Loader.prototype.show = function (parentElement) {
        this.loader = document.createElement('div');
        this.loader.classList.add(loaderClass);
        parentElement.prepend(this.loader);
    }

    Loader.prototype.remove = function () {
        if (!this.loader) {
            return;
        }
        this.loader.remove();
    }

    return Loader;
})()

export default Loader;