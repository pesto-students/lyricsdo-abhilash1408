if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    //The DOMContentLoaded event has already fired. Just run the code.
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
    return "<div class='listContainer'><div class='itemLeft'><img class='albumImage' src='" +
    item.album.cover_medium+"'></div><div class='itemRight'><p><b>Track</b> : " + item.title +
    "</p><p><b>Album</b> : " + item.album.title + "</p><p><b>Artist</b> : " + item.artist.name + "</p></div></div>"
}

function searchTracks(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = 'https://api.lyrics.ovh/suggest/' + formData.get('searchTerm');
    sendXMLHttpRequest('GET', url).then(response => {
        const searchSection = document.getElementById('searchData');
        searchSection.style.display = "block";
        const lyricsSection = document.getElementById('lyricsSection');
        lyricsSection.style.display = "none";
        const searchList = document.getElementById('searchList');
        searchList.innerHTML = "";
        const searchTitle = document.getElementById('searchTitle');
        searchTitle.innerText = "Search Results for : " + formData.get('searchTerm');
        console.log(response.data);
        for (const i in response.data){
            let listItem = document.createElement("li");
            listItem.innerHTML = generateListItemHtml(response.data[i]);
            listItem.onclick = function () {
                getLyrics(response.data[i].artist.name, response.data[i].title, response.data[i].album.title);
            }
            searchList.appendChild(listItem);
        }
    }).catch(errorMessage => {
        console.log(errorMessage)
    });
}

function getLyrics(artist, title, album) {
    const url = "https://api.lyrics.ovh/v1/" + artist + "/" + title;
    sendXMLHttpRequest("GET", url).then(response => {
        const lyricsErrorElement = document.getElementById('lyricsError');
        const searchSection = document.getElementById('searchData');
        const lyricsSection = document.getElementById('lyricsSection');
        if (!response.lyrics) {
            searchSection.style.display = "none";
            lyricsSection.style.display = "none";
            lyricsErrorElement.style.display = "block";
        }
        else {
            lyricsErrorElement.style.display = "none"
            searchSection.style.display = "none";
            lyricsSection.style.display = "block";
            const lyricsData = document.getElementById('lyricsData');
            lyricsData.innerHTML = response.lyrics;
            const lyricsTitle = document.getElementById('lyricsTitle');
            lyricsTitle.innerHTML = "<b>Lyrics</b> : " + title;
            const lyricsDetail = document.getElementById('lyricsDetail');
            lyricsDetail.innerHTML = "<b>Artist</b> : " + artist + " , <b>Album</b> : " + album


        }
      
    }).catch(error => {
        console.log(error)
    })

}

// https://api.lyrics.ovh/v1/artist/title

function afterLoaded() {
    let searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", (e) => searchTracks(e));
  
}
