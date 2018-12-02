import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { WordCloudProvider } from '../../providers/word-cloud/word-cloud';

/*
  Generated class for the SpotifyDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpotifyDataProvider {
  trackData = [];
  artistData = [];
  userData = [];
  list = [['foo', 25], ['bar', 36]];
  spotifyApi = new SpotifyWebApi();

  constructor(public wordCloudService: WordCloudProvider) {
    console.log('Hello SpotifyDataProvider Provider');
  }

  /*  
  * Top Tracks
  */
  getTopTracks() {
    this.spotifyApi.getMyTopTracks({ time_range: "short_term" })
      .then(data => {
        this.trackData = data.items;
        this.getTopArtists();
      }, err => { });
  }

  /*  
  * Top Artists
  */
  getTopArtists() {
    this.spotifyApi.getMyTopArtists({ time_range: "short_term" })
      .then(data => {
        this.artistData = data.items;
        this.collectData();
      }, err => { });
  }

  /*  
  * Gather data
  */
  collectData() {
    this.list = [];
    var size = 40;
    for (let item of this.artistData) {
      this.list.push([item.name, size]);
      size = size - 5;
    }

    for (let item of this.trackData) {
      this.list.push([item.name, item.popularity / 3.5]);
    }

    console.log(this.list);

    this.wordCloudService.generateWordCloud(this.list);

  }

}
