const lyricsBaseURL = 'https://api.lyrics.ovh/v1/';
const suggestionsBaseURL = 'https://api.lyrics.ovh/suggest/';
const LOADER_START = 1;
const LOADER_STOP = 0;

let searchForm;
let searchSection;
let lyricsSection;
let searchList;
let searchTitle;
let lyricsErrorElement;
let lyricsArtist;
let lyricsAlbum;
let lyricsTitle;
let lyricsText;
let searchError;
let searchErrorMessage;
let container;
let recommendations;
let recommendationsList;
let recommendationsData;
let recommendationsError;
let recommendationsErrorMessage;
let loader;

if(document.readyState === 'loading') {
    // Add event listener for DOM Loading
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    //The DOMContentLoaded event is already triggered, so start executing the code.
    afterLoaded();
}

function sendXMLHttpRequest (method, url) {
    // send XMLHttpRequest and return promise
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);
        xhttp.responseType = 'json'
        xhttp.onload = () => {
            if (xhttp.status >= 400) {
                reject('Search Failed... Try again.');
            }
            resolve(xhttp.response)
        }
        xhttp.onerror = () => {
            reject('Search failed... Try again.');
        }
        xhttp.send();
    })
    
}

function generateListItemHtml(item){
    // generate search / recommendation list element
    const itemCard = document.createElement('div');
    itemCard.className = 'itemCard';
    const itemContainer = document.createElement('div');
    itemContainer.className = 'itemContainer';
    const itemLeftSection = document.createElement('div');
    itemLeftSection.className = 'itemLeftSection';
    const albumImageElement = document.createElement('img');
    albumImageElement.className = 'albumImage';
    albumImageElement.setAttribute('src', item.album.cover_medium);
    albumImageElement.setAttribute('alt', item.title);
    itemLeftSection.appendChild(albumImageElement);
    const itemRightSection = document.createElement('div');
    itemRightSection.className = 'itemRightSection';
    itemRightSection.innerHTML = "<p><b>Track</b> : " + item.title + "</p><p><b>Album</b> : " + 
                                item.album.title + "</p><p><b>Artist</b> : " + item.artist.name + "</p>";
    const viewLyricsButton = document.createElement('button')
    viewLyricsButton.className = 'buttonPrimary buttonCentred';
    viewLyricsButton.innerText = 'View Lyrics';
    viewLyricsButton.onclick = function () {
        getLyrics(item.artist.name, item.title, item.album.title);
    }
    itemContainer.appendChild(itemLeftSection);
    itemContainer.appendChild(itemRightSection);
    itemCard.appendChild(itemContainer);
    itemCard.appendChild(viewLyricsButton);
    return itemCard;
}

function setSearchError(error) {
    // set search error
    container.style.display = 'block'
    searchError.style.display = 'block';
    searchSection.style.display = 'none';
    lyricsSection.style.display = 'none';
    searchErrorMessage.innerText = error;
}

function setRecommendationsError(error) {
    // set recommendations error
    recommendationsData.style.display = "none";
    recommendationsError.style.display = "block"
    recommendationsErrorMessage.innerText = error;
}

function getRecommendations(song) {
    // get recommendations for start state
    handleLoader(LOADER_START);
    const suggestionsUrl = suggestionsBaseURL + song;
    sendXMLHttpRequest('GET', suggestionsUrl).then(response => {
        if (response.data.length === 0) {
            setRecommendationsError('No results found.')
        }
        else {
            for (const itemData of response.data) {
                recommendationsList.appendChild(generateListItemHtml(itemData));
            }
            recommendations.style.display = "block";
            handleLoader(LOADER_STOP);
        }
    }).catch(errorMessage => {
        handleLoader(LOADER_STOP);
        setSearchError(errorMessage);
    });
}

function getSuggestions(e) {
    // Interrupt the default form submit and add custom handling
    handleLoader(LOADER_START);
    e.preventDefault();
    recommendations.style.display = 'none';
    container.style.display = "none";
    const formData = new FormData(e.target);
    const suggestionsUrl = suggestionsBaseURL + formData.get('searchTerm');
    sendXMLHttpRequest('GET', suggestionsUrl).then(response => {
        if (response.data.length === 0) {
            setSearchError('No results found.')
        }
        else {
            searchSection.style.display = 'block';
            lyricsSection.style.display = 'none';
            searchError.style.display = 'none';
            searchList.innerHTML = '';
            searchTitle.innerText = 'Search Results for : ' + formData.get('searchTerm');
            for (const itemData of response.data) {
                searchList.appendChild(generateListItemHtml(itemData));
            }
            container.style.display = 'block';
            handleLoader(LOADER_STOP);
        }
    }).catch(errorMessage => {
        handleLoader(LOADER_STOP);
        setSearchError(errorMessage);
    });
    
}

function getLyrics(artist, title, album) {
    // fetch lyrics from api
    handleLoader(LOADER_START);
    const lyricsUrl = lyricsBaseURL + artist + '/' + title;
    recommendations.style.display = "none";
    container.style.display = "none";
    sendXMLHttpRequest('GET', lyricsUrl).then(response => {
        if (!response.lyrics) {
            searchSection.style.display = 'none';
            lyricsSection.style.display = 'none';
            lyricsErrorElement.style.display = 'block';
        }
        else {
            lyricsErrorElement.style.display = 'none'
            searchSection.style.display = 'none';
            lyricsSection.style.display = 'block';
            lyricsText.innerHTML = response.lyrics;
            lyricsTitle.innerHTML = '<b>Lyrics</b> : ' + title;
            lyricsArtist.innerHTML = '<b>Artist</b> : ' + artist;
            lyricsAlbum.innerHTML = '<b>Album</b> : ' + album;
        }
        container.style.display = "block";
        handleLoader(LOADER_STOP);
    }).catch(error => {
        container.style.display = "block";
        handleLoader(LOADER_STOP);
    })

}

function loadDOMReferences() {
    // function to load all DOM element references in global context
    searchForm = document.getElementById('searchForm');
    searchSection = document.getElementById('searchData');
    lyricsSection = document.getElementById('lyricsSection');
    searchList = document.getElementById('searchList');
    searchTitle = document.getElementById('searchTitle');
    lyricsErrorElement = document.getElementById('lyricsError');
    lyricsArtist = document.getElementById('lyricsArtist');
    lyricsAlbum = document.getElementById('lyricsAlbum');
    lyricsTitle = document.getElementById('lyricsTitle');
    lyricsText = document.getElementById('lyricsText');
    searchError = document.getElementById('searchError');
    searchErrorMessage = document.getElementById('searchErrorMessage');
    container = document.getElementById('container');
    recommendations = document.getElementById('recommendations');
    recommendationsList = document.getElementById('recommendationsList');
    recommendationsData = document.getElementById('recommendationsData');
    recommendationsError = document.getElementById('recommendationsError');
    recommendationsErrorMessage = document.getElementById('recommendationsErrorMessage');
    loader = document.getElementById('loader');

}

function handleLoader(command) {
    // function to handle loader start/ stop
    if (command === LOADER_START) {
        loader.style.display = "block";
    } else {
        loader.style.display = "none";
    }
}

function afterLoaded() {
    // executing after page is loaded
    loadDOMReferences();
    getRecommendations("smells like teen spirit");
    searchForm.addEventListener('submit', (e) => getSuggestions(e));
}
