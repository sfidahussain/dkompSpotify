import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, Loading } from 'ionic-angular';
import SpotifyWebApi from 'spotify-web-api-js';
import { Storage } from '@ionic/storage';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  result = {};
  spotifyApi = new SpotifyWebApi();
  loading: Loading;
  loggedIn = false;
  data = [];

  constructor(public navCtrl: NavController, private storage: Storage, private plt: Platform, private loadingCtrl: LoadingController) {
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
      scopes: ["streaming", "playlist-read-private", "user-read-email", "user-read-private"],
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

  getUserData() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading Data...'
    });
    this.loading.present();

    this.spotifyApi.getUserPlaylists()
      .then(data => {
        this.result = { data : data };
        if (this.loading) {
          this.loading.dismiss();
        }
        this.data = data.items;
      }, err => {
        if (this.loading) {
          this.loading.dismiss();
        }
      });
  }

  openWordCloud(item) {
    this.navCtrl.push('WordCloudPage', { playlist: item });
  }

  logout() {
    cordova.plugins.spotifyAuth.forget();

    this.loggedIn = false;
    this.data = [];
    this.storage.set('logged_in', false);
  }

}
