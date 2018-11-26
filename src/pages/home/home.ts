import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';
import SpotifyWebApi from 'spotify-web-api-js';
import { Storage } from '@ionic/storage';
import * as WordCloud from 'wordcloud';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  // Basic variables and arrays
  list = [['foo', 25], ['bar', 36]];
  result = {};
  spotifyApi = new SpotifyWebApi();
  loading: Loading;
  loggedIn = false;
  trackData = [];
  artistData = [];
  genreData = [];
  userData = [];
  wordcloud = null;

  constructor(public navCtrl: NavController, private storage: Storage, private plt: Platform, private loadingCtrl: LoadingController) {
    this.plt.ready().then(() => {
      // this.wordcloud = WordCloud(document.getElementById("canvas"), { list: this.list } );
      this.storage.get('logged_in').then(res => {
        if (res) {
          this.authWithSpotify(true);
        }
      })
    });
  }

  authWithSpotify(showLoading = false) {
    const config = {
      clientId: "72f859bddc94420ca127bb729336d56d",
      redirectUrl: "devdacticspotify://callback",
      scopes: ["streaming", "playlist-read-private", "user-read-email", "user-read-private", "user-top-read"],
      tokenExchangeUrl: "https://dkomp.herokuapp.com/exchange",
      tokenRefreshUrl: "https://dkomp.herokuapp.com/refresh",
    };

    if (showLoading) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }

    cordova.plugins.spotifyAuth.authorize(config)
      .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.spotifyApi.setAccessToken(accessToken);
        this.loggedIn = true;
        this.storage.set('logged_in', true);
        this.getUserData();
      }, err => {
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }

  /*  
  * Retrieve user data through Spotify endpoints:
  * Top Tracks
  * Top Artists
  * Recommended Genres 
  */

  getUserData() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Data...'
    });
    this.loading.present();
    this.getTopTracks();
    // this.getTopArtists();
    // this.getGenres();
  }

  /*  
  * Top Tracks
  */
  getTopTracks() {
    this.spotifyApi.getMyTopTracks()
      .then(data => {
        this.trackData = data.items;
        console.log(this.trackData);
        this.getTopArtists();
      }, err => {});
  }

  /*  
  * Top Artists
  */
  getTopArtists() {
    this.spotifyApi.getMyTopArtists()
      .then(data => {
        this.artistData = data.items;
        console.log(this.artistData);
        this.getGenres();
      }, err => {});
  }

  /*  
  * Recommended Genres
  */
  getGenres() {
    this.spotifyApi.getAvailableGenreSeeds()
      .then(data => {
        if (this.loading) {
          this.loading.dismiss();
        }
        this.genreData = data.genres;
        console.log(this.genreData);
        this.list = [['foo', 25], ['bar', 36]];
        console.log(this.list);
        this.wordcloud = WordCloud(document.getElementById("canvas"), { list: this.list } );
      }, err => {});
  }

  openWordCloud(item) {
    this.navCtrl.push('WordCloudPage', { wordcloud : item });
  }

  logout() {
    cordova.plugins.spotifyAuth.forget();

    this.loggedIn = false;
    this.trackData = [];
    this.artistData = [];
    this.genreData = [];
    this.userData = [];
    this.storage.set('logged_in', false);
    this.list = [];
    this.wordcloud = WordCloud(document.getElementById("canvas"), { list: this.list } );
  }

}