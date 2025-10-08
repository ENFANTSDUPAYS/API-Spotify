export async function fetchPlaylist(token) {
    const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export function playlistUI(playlists) {
    const container = document.getElementById("mini-container-playlist");

    if (!playlists || !playlists.items || playlists.items.length === 0) {
        container.innerText = "Aucun résultat trouvé.";
        return;
    }
    document.getElementById('count-playlist').innerText =
        "Nombre de playlists trouvés : " + playlists.items.length;

    playlists.items.forEach(playlist => {
        const playlistDiv = document.createElement("div");
        playlistDiv.classList.add("mini-container");

        const link = document.createElement("a");
        link.href = playlist.uri;
        link.target = "_blank";

        const img = document.createElement("img");
        img.alt = `Cover playlist ${playlist.name}`;
        if (playlist.images && playlist.images.length > 0) {
            img.src = playlist.images[0].url;
        }
        link.appendChild(img);

        const span = document.createElement("span");
        span.innerText = playlist.name;

        playlistDiv.appendChild(link);
        playlistDiv.appendChild(span);

        container.appendChild(playlistDiv);
    });
}
