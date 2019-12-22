import { Component } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';
import { Blog } from '../services/interface.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  navParams: any;
  articles: Array<Blog> = [];

  constructor(private shared: SharedService, private route: ActivatedRoute, private router: Router) {
    this.loadCategory();
  }

  ionViewDidEnter() {
    let navParams;

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        navParams = this.router.getCurrentNavigation().extras.state;
        console.log('navparams ', navParams);
        this.getArticles();
      } else {
        this.loadCategory()
      }
    })
    this.loadCategory();
  }

  loadCategory() {
    this.getArticles();
  }
  
  getArticles() {
    this.shared.getArticles().subscribe(response => {
      this.articles = response.blogs;
      this.shared.saveArticlesToStorage(response);
    })
  }

  filterCategory(event) {
    console.log(event);
  }

}
