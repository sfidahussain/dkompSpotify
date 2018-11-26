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
    this.spotifyApi.getMyTopTracks({time_range: "short_term"})
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
    this.spotifyApi.getMyTopArtists({time_range: "short_term"})
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
        this.list = [
        ];
        // for (let item of this.artistData) {
        //   for (var i = 0; i < 3; i++) {
        //     this.list.push([item.genres, 20]);
        //   }
        // }
        var size = 30;
        for (let item of this.artistData) {
          this.list.push([item.name, size ]);
          size = size - 5;
        }
        
        for (let item of this.trackData) {
          this.list.push([item.name, item.popularity / 3]);
        }
        console.log(this.list);
        // Our canvas must cover full height of screen
        // regardless of the resolution
        var height = window.innerHeight;
        
        // So we need to calculate the proper scaled width
        // that should work well with every resolution
        var canvas = document.getElementById("canvas");
        // var ratio = canvas.offsetWidth/canvas.offsetHeight;
        // var width = height * ratio;
        
        // canvas.style.width = width+'px';
        // canvas.style.height = height+'px';
        
        this.wordcloud = WordCloud(document.getElementById("canvas"), 
        { 
          list: this.list, 
            // gridSize: Math.round(16 * canvas.offsetWidth / 1024),
            weightFactor: 1.5,
            fontFamily: 'Times, serif',
            color: function (word, weight) {
              return (weight === 12) ? '#f02222' : '#c09292';
            },
            rotateRatio: 0.5,
            minRotation: 80.1,
            maxRotation: 80.1,
            backgroundColor: '#ffe0e0'
        });
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