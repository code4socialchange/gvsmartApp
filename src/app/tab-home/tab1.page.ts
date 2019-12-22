import { Component, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular'
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class HomePage {

  @ViewChild(IonSlides, null) slides: IonSlides;

  slideOpts = {
    slidesPerView: 2,
    spaceBetween: 5
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  loadArticles(category = null) {
    this.router.navigate(['home', 'tab-news'], {
      state: {
        category: category
      }
    });
  }

}
