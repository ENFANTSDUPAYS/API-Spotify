import { initKey } from "./initKey.js";
import { redirectToAuthCodeFlow, getAccessToken } from "./initAuth.js";
import { fetchProfile, populateUI } from "./initProfile.js";
import { fetchArtiste, artisteUI } from "./initArtist.js";
import { fetchPlaylist, playlistUI } from "./initPlaylist.js";
import { fetchSearchTrack, searchUI } from "./initSearch.js";
import { initClear } from "./initUtils.js";

const clientId = initKey;

// Clear
window.initClear = initClear;

const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let accessToken = localStorage.getItem("access_token");
const expiry = localStorage.getItem("token_expiry");

if (!accessToken || Date.now() >= expiry) {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        accessToken = await getAccessToken(clientId, code);
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("token_expiry", Date.now() + 3600 * 1000);
    }
}

// Fetch & UI
const profile = await fetchProfile(accessToken);
populateUI(profile);

const data = await fetchArtiste(accessToken);
artisteUI(data.artists.items);

const playlists = await fetchPlaylist(accessToken);
playlistUI(playlists);

// Search
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    const music = await fetchSearchTrack(accessToken, query);
    searchUI(music);
});
