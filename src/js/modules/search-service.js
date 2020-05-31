const SearchService = (function() {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/';
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchMethods = {};

    searchMethods.getVideos = async function(searchRequest) {
        const url = `${apiUrl}search?$key=${apiKey}&type=video&part=snippet&maxResults=15&q=${searchRequest}`;
        let videos;

        const response = await fetch(url);

        if (response.ok) {
            videos = await response.json();
        } else {
            alert("Ошибка HTTP: " + response.status);
        }

        return videos;
    }

    return searchMethods;
})();

export default SearchService;

