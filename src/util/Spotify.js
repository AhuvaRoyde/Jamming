const clientID = 'fbfd4f3415fc45a2a5adb8b9eab106ef';
const redirectURI = "http://localhost:3000/";

let accessToken;
const headers = {headers: {Authorization: `Bearer ${accessToken}`}};
let userID;
let playlistID;

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }
        if(window.location.href.match(/access_token=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/);
            const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
            setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        };
    },

    async search(searchTerm) {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            {
                headers: headers
            }
        );
        const jsonResponse = await response.json();
        //let trackArray = [];
        return jsonResponse.map(track => {
            return {
                ID: track.id,
                Name: track.name,
                Artist: track.artists[0].name,
                Album: track.album.name,
                URI: track.uri
            };
        });
    },

    async savePlaylist(playlistName, uris) {
        if(!playlistName || !uris) {
            return;
        };
        let response;
        let jsonResponse;
        response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
        jsonResponse = await response.json();
        userID = jsonResponse.id;
        response = await fetch(`https://api.spotify.com/v1/users/{userID}/playlists`, {headers: headers, method: 'POST', body: {name: playlistName}});
        jsonResponse = await response.json();
        playlistID = jsonResponse.id;
        fetch(`https://api.spotify.com/v1/playlists/{playlistID}/tracks`, {headers: headers, method: 'POST', body: {uris: uris}});
    }
};
export default Spotify;