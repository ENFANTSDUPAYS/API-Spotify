export async function fetchSearchTrack(token, query) {
    const result = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&include_external=audio&limit=20`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return await result.json();
}

export function searchUI(search) {
    const container = document.getElementById("search-results");

    if (!search.tracks || !search.tracks.items || search.tracks.items.length === 0) {
        container.innerText = "Aucun résultat trouvé.";
        return;
    }
    document.getElementById('count-music').innerText =
        "Nombre de musiques trouvés : " + search.tracks.items.length;

    search.tracks.items.forEach(track => {
        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("track-item");
        link.dataset.src = `https://open.spotify.com/embed/track/${track.id}`;

        const title = document.createElement("span");
        title.innerText = track.name;

        const artistNames = track.artists.map(a => a.name).join(", ");
        const artists = document.createElement("span");
        artists.innerText = " - " + artistNames;

        link.appendChild(title);
        link.appendChild(artists);
        container.appendChild(link);
    });

    // Gestion Iframe
    const containerIframe = document.getElementById('container-iframe');
    const trackItems = document.querySelectorAll('.track-item');

    trackItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const src = item.dataset.src;
            const iframe = document.getElementById('iframe-player');
            iframe.src = src;

            containerIframe.style.display = 'flex';
            setTimeout(() => containerIframe.classList.add('show'), 10);
        });
    });

    containerIframe.addEventListener('click', () => {
        containerIframe.classList.remove('show');
        setTimeout(() => {
            containerIframe.style.display = 'none';
            document.getElementById('iframe-player').src = "";
        }, 300);
    });
}
