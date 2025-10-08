# 🎵 Spotify Web App

Ce projet est une petite application web qui utilise l’API Spotify pour interagir avec le compte de l’utilisateur.  
Elle permet de s’authentifier via OAuth2 (PKCE), puis d’accéder aux données de Spotify comme : les artistes suivis, les musiques recherchées et les playlists personnelles.

## ✨ Fonctionnalités principales
- 🔑 Authentification sécurisée avec OAuth2 PKCE
- 👩‍🎤 Récupération et affichage des artistes suivis
- 🎶 Recherche de musiques dans le catalogue Spotify
- 📂 Récupération et affichage des playlists de l’utilisateur
- ▶️ Lecture via Spotify Embed (iframe)

## 🛠️ Stack technique
- **HTML / CSS** pour l’interface utilisateur
- **JavaScript (Vanilla)** pour les appels API et le rendu dynamique
- **Fetch API** pour interroger l’API Spotify
- **Spotify Web API** comme service externe

## 🚀 Utilisation
1. Créer une application sur le [Dashboard Spotify Developer](https://developer.spotify.com/dashboard).
2. Configurer les Redirect URIs et récupérer le `client_id`.
3. Lancer le projet en local et se connecter via le bouton Login.
4. Une fois connecté, l’utilisateur peut explorer ses données Spotify.

---

API-SPOTIFY/
├── dist/                         # Build final généré par Vite (production)
├── node_modules/                 # Dépendances installées via npm
├── public/                       # Fichiers statiques copiés sans transformation
│   └── vite.svg                  # Exemple de ressource statique
├── src/                          # Code source principal de l’application
│   ├── initKey.js                # Clé Client Spotify (clientId)
│   ├── InitAuth.js               # Gestion de l’authentification (OAuth2 PKCE)
│   ├── initArtist.js             # Récupération + affichage des artistes suivis
│   ├── initPlaylist.js           # Récupération + affichage des playlists
│   ├── initProfile.js            # Récupération + affichage du profil utilisateur
│   ├── initSearch.js             # Recherche de musiques + affichage dans l’UI
│   ├── initUtils.js              # Fonctions utilitaires (clear localStorage, PKCE, etc.)
│   ├── main.js                   # Point d’entrée global, orchestre tous les modules
│   └── assets/
│       └── style.css             # Feuille de style principale
├── .gitignore                    # Fichiers/dossiers ignorés par Git
├── index.html                    # Page HTML racine (inclut main.js via Vite)
├── package.json                  # Dépendances + scripts npm (ex: dev, build)
├── package-lock.json             # Versions figées des dépendances
├── vite.config.js                # Configuration Vite (dev server, build, plugins)
└── README.md                     # Documentation du projet



