import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss'],
})
export class SingleArticleComponent implements OnInit {

  @Input() article: any;

  constructor(private navParams: NavParams, private shared: SharedService, private sanitizer: DomSanitizer, private modalCtrl: ModalController) { 
    this.article = this.navParams.get('article');
    console.log(this.article);
  }

  ngOnInit() {
    this.getArticleDetail();
  }

  getArticleDetail() {
    this.shared.getArticle(this.article.id).subscribe(response => {
      this.article = { ...this.article, ...response.blog };
      this.article.content = this.sanitizer.bypassSecurityTrustHtml(this.article.content);
    })
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
