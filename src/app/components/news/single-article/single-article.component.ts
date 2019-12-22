import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss'],
})
export class SingleArticleComponent implements OnInit {

  @Input() article: any;
  isVideo: boolean = false;
  videoSrc: string;

  constructor(private navParams: NavParams, private shared: SharedService, private sanitizer: DomSanitizer, private modalCtrl: ModalController) { 
    this.article = this.navParams.get('article');
    if (this.article.category === 'Video') {
      this.videoSrc = 'http://192.168.0.107:3000/videos/' + this.article.content;
      this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(this.videoSrc) as string;
      this.isVideo = true;
    } else {
      this.article.content = this.sanitizer.bypassSecurityTrustHtml(this.article.content)
    }
    console.log(this.article);
  }

  ngOnInit() { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
