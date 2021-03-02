import './App.css';
import React from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        id: 555,
        name: "Someday",
        artist: "MBD",
        album: "Just One Shabbos",
        uri: 555
      }],
      playlistName: 'New Playlist',
      playlistTracks: [{
        id: 555,
        name: "Someday",
        artist: "MBD",
        album: "Just One Shabbos",
        uri: 555
      }]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    if(playlistTracks.find(listTrack => listTrack.id === track.id)) {
      return;
    };
    playlistTracks.push(track);
    this.setState({playlistTracks: playlistTracks});
  }

  removeTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    const newPlaylistTracks = playlistTracks.filter(listTrack => listTrack.id !== track.id);
    this.setState({playlistTracks: newPlaylistTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const playlistTracks = this.state.playlistTracks;
    const uris = playlistTracks.map(listTrack => listTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, uris);
    this.setState({playlistName: 'New Playlist', playlistTracks: []});
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
    .then(jsonResponse => this.setState({
      searchResults: jsonResponse
    }));
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd = {this.addTrack}/>
            <Playlist playlistName = {this.state.playlistName} playlistTracks = {this.state.playlistTracks} onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
