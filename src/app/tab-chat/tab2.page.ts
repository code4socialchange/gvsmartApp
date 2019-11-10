import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab-chat',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private navCtrl: NavController) {}

  openChat(chat) {
    this.navCtrl.navigateForward('single-chat', {
      state: chat
    })
  }

  loadContacts() {
    this.navCtrl.navigateForward('contacts')
  }

}
