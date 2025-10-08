import { initKey } from "./initKey";

const clientId = initKey;

//FUNCTION POUR CLEAR
window.initClear = function() {
    if (confirm("Voulez-vous vraiment effacer toutes les données locales ?")) {
        localStorage.clear();
         window.history.replaceState({}, document.title, window.location.pathname);
        location.reload();
    }
};

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let accessToken = localStorage.getItem("access_token");//MODE LOCAL STORAGE POUR STOCKER LE TOKEN
const expiry = localStorage.getItem("token_expiry");

if (!accessToken || Date.now() >= expiry) {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expiry", Date.now() + 3600 * 1000);//TOKEN 1H
    }
}
const profile = await fetchProfile(accessToken);
const data = await fetchArtiste(accessToken);
populateUI(profile);
artisteUI(data.artists.items);



async function redirectToAuthCodeFlow(clientId) {
const verifier = generateCodeVerifier(128);
const challenge = await generateCodeChallenge(verifier);

localStorage.setItem("verifier", verifier);

const params = new URLSearchParams();
params.append("client_id", clientId);
params.append("response_type", "code");
params.append("redirect_uri", "http://127.0.0.1:5173/callback");
params.append("scope", "user-read-private user-read-email user-follow-read");
params.append("code_challenge_method", "S256");
params.append("code_challenge", challenge);

document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}


async function fetchProfile(token) {
const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

function populateUI(profile) {
document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {
        const profileImage = new Image(200, 200);
        profileImage.src = profile.images[0].url;
        document.getElementById("avatar").appendChild(profileImage);
        document.getElementById("imgUrl").innerText = profile.images[0].url;
    }
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
}

async function fetchArtiste(token) {
    let limit = 30;
    const result = await fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

function artisteUI(artists){
    const container = document.getElementById("mini-container");
    document.getElementById('count-artiste').innerText =
        "Nombre d'artistes trouvés : " + artists.length;

    artists.forEach(artist => {
        const artistDiv = document.createElement("div");
        artistDiv.classList.add("mini-container");

        const link = document.createElement("a");
        link.href = artist.uri;
        link.target = "_blank";

        const img = document.createElement("img");
        img.alt = `photo de profil de ${artist.name}`;
        if (artist.images && artist.images.length > 0) {
            img.src = artist.images[0].url;
        }
        link.appendChild(img);

        const span = document.createElement("span");
        span.innerText = artist.name;

        artistDiv.appendChild(link);
        artistDiv.appendChild(span);

        container.appendChild(artistDiv);
    });
}


//RECHERCHE DE MUSIQUE
async function fetchSearchTrack(token, query) {
    let limit = 20
    const result = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&include_external=audio&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return await result.json();
}

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");

form.addEventListener("submit", async (e) => {
    const query = input.value.trim();
    if (!query) return;

    const music = await fetchSearchTrack(accessToken, query);
    searchUI(music);
});


function searchUI(search){
    const container = document.getElementById("search-results");

    if (!search.tracks || !search.tracks.items || search.tracks.items.length === 0) {
        container.innerText = "Aucun résultat trouvé.";
        return;
    }
    document.getElementById('count-music').innerText =
        "Nombre de musiques trouvés : " + search.tracks.items.length;

    search.tracks.items.forEach(track => {
        const trackDiv = document.createElement("div");
        trackDiv.classList.add("track-item");

        const title = document.createElement("span");
        title.innerText = track.name;

        const artistNames = track.artists.map(a => a.name).join(", ");
        const artists = document.createElement("span");
        artists.innerText = " - " + artistNames;

        trackDiv.appendChild(title);
        trackDiv.appendChild(artists);
        container.appendChild(trackDiv);
    });
}