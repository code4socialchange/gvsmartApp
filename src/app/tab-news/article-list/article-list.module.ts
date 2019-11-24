import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ArticleListPage } from './article-list.page';

const routes: Routes = [
  {
    path: '',
    component: ArticleListPage,
    loadChildren: () => import('./../single-article/single-article.module').then(m => m.SingleArticlePageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArticleListPage]
})
export class ArticleListPageModule {}
