export async function fetchArtiste(token) {
    const result = await fetch(`https://api.spotify.com/v1/me/following?type=artist&limit=30`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export function artisteUI(artists) {
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
