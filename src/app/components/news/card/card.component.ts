import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SingleArticleComponent } from '../single-article/single-article.component';

@Component({
  selector: 'news-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class NewsCardComponent implements OnInit {

  @Input() article: any;

  constructor(private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {}

  async loadArticle() {
    const singleArticle = await this.modalCtrl.create({
      component: SingleArticleComponent,
      componentProps: {
        article: this.article
      }
    });
    return await singleArticle.present();
  }

}
