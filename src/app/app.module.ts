import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Media } from '@ionic-native/media';
import { SocialSharing } from '@ionic-native/social-sharing';
 
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { SpotifyDataProvider } from '../providers/spotify-data/spotify-data';
import { WordCloudProvider } from '../providers/word-cloud/word-cloud';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Media,
    SocialSharing,
    File,
    SpotifyDataProvider,
    WordCloudProvider
  ]
})
export class AppModule {}