import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab3Page } from './tab3.page';
import { NewsCardComponent } from './../components/news/card/card.component';
import { ArticleListPage } from './article-list/article-list.page';
import { SingleArticleComponent } from '../components/news/single-article/single-article.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { 
        path: '', 
        component: Tab3Page
      }
    ])
  ],
  declarations: [
    Tab3Page,
    NewsCardComponent,
    SingleArticleComponent
  ],
  entryComponents: [
    SingleArticleComponent
  ]
})
export class Tab3PageModule {}
