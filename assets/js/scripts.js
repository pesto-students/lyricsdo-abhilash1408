const lyricsBaseURL = 'https://api.lyrics.ovh/v1/';
const suggestionsBaseURL = 'https://api.lyrics.ovh/suggest/';

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


if(document.readyState === 'loading') {
    // Add event listener for DOM Loading
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    //The DOMContentLoaded event is already triggered, so start executing the code.
    afterLoaded();
}

function sendXMLHttpRequest (method, url) {
    return new Promise((resolve, reject) => {
        var xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);
        xhttp.responseType = 'json'
        xhttp.onload = () => {
            console.log("status : ", xhttp.status)
            if (xhttp.status >= 400) {
                reject("Request failed with error : " + xhttp.status.toString());
            }
            resolve(xhttp.response)
        }
        xhttp.onerror = () => {
            reject("Request failed");
        }
        xhttp.send();
    })
    
}

function generateListItemHtml(item){
    const itemHtml = "<div class='listContainer'><div class='itemLeft'><img class='albumImage' src='" +
    item.album.cover_medium + "' alt = '" + item.title + "'></div><div class='itemRight'><p><b>Track</b> : " + item.title +
    "</p><p><b>Album</b> : " + item.album.title + "</p><p><b>Artist</b> : " + item.artist.name + "</p></div></div>";
    return itemHtml;
}

function getSuggestions(e) {
    // Interrupt the default form submit and add custom handling
    e.preventDefault();
    const formData = new FormData(e.target);
    const suggestionsUrl = suggestionsBaseURL + formData.get('searchTerm');
    sendXMLHttpRequest('GET', suggestionsUrl).then(response => {
        searchSection.style.display = "block";
        lyricsSection.style.display = "none";
        searchList.innerHTML = "";
        searchTitle.innerText = "Search Results for : " + formData.get('searchTerm');
        for (const itemData of response.data){
            let listItem = document.createElement("li");
            listItem.innerHTML = generateListItemHtml(itemData);
            listItem.onclick = function () {
                getLyrics(itemData.artist.name, itemData.title, itemData.album.title);
            }
            searchList.appendChild(listItem);
        }
    }).catch(errorMessage => {
        console.log(errorMessage)
    });
}

function getLyrics(artist, title, album) {
    const lyricsUrl = lyricsBaseURL + artist + "/" + title;
    sendXMLHttpRequest("GET", lyricsUrl).then(response => {
        if (!response.lyrics) {
            searchSection.style.display = "none";
            lyricsSection.style.display = "none";
            lyricsErrorElement.style.display = "block";
        }
        else {
            lyricsErrorElement.style.display = "none"
            searchSection.style.display = "none";
            lyricsSection.style.display = "block";
            lyricsText.innerHTML = response.lyrics;
            lyricsTitle.innerHTML = "<b>Lyrics</b> : " + title;
            lyricsArtist.innerHTML = "<b>Artist</b> : " + artist;
            lyricsAlbum.innerHTML = "<b>Album</b> : " + album;
        }
    }).catch(error => {
        console.log(error)
    })

}

function loadDOMReferences() {
    searchForm = document.getElementById("searchForm");
    searchSection = document.getElementById('searchData');
    lyricsSection = document.getElementById('lyricsSection');
    searchList = document.getElementById('searchList');
    searchTitle = document.getElementById('searchTitle');
    lyricsErrorElement = document.getElementById('lyricsError');
    lyricsArtist = document.getElementById('lyricsArtist');
    lyricsAlbum = document.getElementById('lyricsAlbum');
    lyricsTitle = document.getElementById('lyricsTitle');
    lyricsText = document.getElementById('lyricsText');
}

function afterLoaded() {
    loadDOMReferences();
    searchForm.addEventListener("submit", (e) => getSuggestions(e));
}