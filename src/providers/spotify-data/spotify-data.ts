import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { HttpClient } from '@angular/common/http';
import { WordCloudProvider } from '../../providers/word-cloud/word-cloud';

/*
  Generated class for the SpotifyDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpotifyDataProvider {
  baseURL = "https://groceries-server-demo-sanaa.herokuapp.com";

  item = {
    userName: "", 
    keywords: []
  };

  trackData = [];
  artistData = [];
  userData = [];
  list = [['foo', 25], ['bar', 36]];
  spotifyApi = new SpotifyWebApi();

  constructor(public wordCloudService: WordCloudProvider, public http: HttpClient) {
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

    this.spotifyApi.getMe()
    .then(data => {
      this.item.userName = data.display_name;
    });

    this.item.keywords = this.list;

    this.addItem(this.item);

    this.wordCloudService.generateWordCloud(this.list);

  }

  addItem(item) {
    this.http.post(this.baseURL + "/api/dKomp/", item).subscribe(res => {
      console.log('adding item from db');
    });
  }

}
