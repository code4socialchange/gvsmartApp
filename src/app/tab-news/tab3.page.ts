import { Component } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';
import { Blog } from '../services/interface.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  articles: Array<Blog> = [];

  constructor(private shared: SharedService) {}

  ionViewDidEnter() {
    this.getArticles();
  }
  
  getArticles() {
    this.shared.getArticles().subscribe(response => {
      this.articles = response.blogs;
    })
  }

}
