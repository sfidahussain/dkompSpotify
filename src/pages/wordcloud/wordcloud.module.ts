import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WordcloudPage } from './wordcloud';

@NgModule({
  declarations: [
    WordcloudPage,
  ],
  imports: [
    IonicPageModule.forChild(WordcloudPage),
  ],
})
export class WordcloudPageModule {}
