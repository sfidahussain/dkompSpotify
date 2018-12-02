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
      fontFamily: 'Sedgwick Ave',
      color: '#77a2b4',
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#f6e9d5'
    });
  }

  pinkTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Finger Paint',
      color: '#eb048c',
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#fff300'
    });
    console.log('pink' + this.list);
  }

  handwrittenTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Sedgwick Ave',
      color: '#77a2b4',
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#f6e9d5'
    });
    console.log('handwritten' + this.list);
  }

  darkTheme() {
    this.wordcloud = WordCloud(document.getElementById("canvas"),
    {
      list: this.list,
      weightFactor: 1.5,
      fontFamily: 'Megrim',
      color: '#1aa723',
      rotateRatio: 0.5,
      minRotation: 80.1,
      maxRotation: 80.1,
      backgroundColor: '#000000'
    });
    console.log('dark' + this.list);
  }

}
