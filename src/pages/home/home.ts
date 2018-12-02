import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';
import SpotifyWebApi from 'spotify-web-api-js';
import { Storage } from '@ionic/storage';
import * as WordCloud from 'wordcloud';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SpotifyDataProvider } from '../../providers/spotify-data/spotify-data';
import { WordCloudProvider } from '../../providers/word-cloud/word-cloud';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  spotifyApi = new SpotifyWebApi();
  loading: Loading;
  loggedIn = false;
  wordcloud = null;
  list = [['foo', 25], ['bar', 36]];

  constructor(public navCtrl: NavController, public wordCloudService: WordCloudProvider, public spotifyDataService: SpotifyDataProvider, private storage: Storage, private plt: Platform, private loadingCtrl: LoadingController, public socialSharing: SocialSharing) {
    this.plt.ready().then(() => {
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
        if (this.loading) {
          this.loading.dismiss();
        }
      }, err => {
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }

  getUserData() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Data...'
    });
    this.loading.present();
    this.spotifyDataService.getTopTracks();
  }

  changeTheme(theme) {
    switch(theme) {
      case "handwritten" : {
        this.wordCloudService.handwrittenTheme();
        console.log('hit handwritten');
        break;
      }
      case "pink" : {
        this.wordCloudService.pinkTheme();
        console.log('hit pink');
        break;
      }
      case "dark" : {
        this.wordCloudService.darkTheme();
        console.log('hit dark');
        break;
      }
      default: {
        console.log('default case');
        break;
      }
    }
  }

  saveCanvasImage() {
    var canvas = document.querySelector('canvas');
    var dataURL = canvas.toDataURL();
    this.socialSharing.share("", null, dataURL, null);
  }

  logout() {
    cordova.plugins.spotifyAuth.forget();
    this.loggedIn = false;
    this.storage.set('logged_in', false);
    this.wordcloud = WordCloud(document.getElementById("canvas"), { list: [] });
  }

}