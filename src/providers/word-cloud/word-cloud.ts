// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as WordCloud from 'wordcloud';
 
/*
  Generated class for the WordCloudProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WordCloudProvider {

  wordcloud = null;
  list = [['foo', 25], ['bar', 36]];

  constructor() {
    console.log('Hello WordCloudProvider Provider');
  }

  generateWordCloud(list) {
    this.list = list;
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Lato, sans-serif',
      color: function() {
        return (['#fffffc', '#00e6f7'])[Math.floor(Math.random() * 2)]
      },
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#1dc2f6'
    });
    console.log('pink' + this.list);
  }

  pinkTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Lato, sans-serif',
      color: function() {
        return (['#fffffc', '#00e6f7'])[Math.floor(Math.random() * 2)]
      },
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#1dc2f6'
    });
    console.log('pink' + this.list);
  }

  handwrittenTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Oswald, sans-serif',
      color: function() {
        return (['#ef4a30', '#ffca2e', '#dde4db', '#255b6e', '#feccb2'])[Math.floor(Math.random() * 3)]
      },
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#fffaf8'
    });
    console.log('handwritten' + this.list);
  }

  darkTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Tropical Asian, sans-serif',
      color: '#fcfcfc',
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#131313'
    });
    console.log('dark' + this.list);
  }
  

}
