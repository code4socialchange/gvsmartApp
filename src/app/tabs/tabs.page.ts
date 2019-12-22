import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

import { SharedService } from '../services/shared/shared.service';
import { LoggerService } from '../services/logger/logger.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  observeLoggedInUserSubscription: Subscription;
  isEntrepreneurUser: boolean = false;

  constructor(private shared: SharedService, private chatService: ChatService, private log: LoggerService, private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {
    console.log('Fetching Contacts');
    this.observeLoggedInUser();
    this.chatService.getContacts();
  }

  async getUserData() {
    const user = await this.shared.getUserFromStorage();
    (user.role == 'entrepreneur') ? this.isEntrepreneurUser = true : null;
  }

  observeLoggedInUser() {
    this.observeLoggedInUserSubscription = this.shared.LoggedInUser$.subscribe(response => {
      if (response) {
        this.chatService.getContacts();
      }
    })
  }

  async logoutConfirmation() {

    const logoutAlert = await this.alertCtrl.create({
      header: 'Logout?',
      message: `Are you sure you want to logout? This action will remove all the unsynced items and also clear your app's local memory`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          cssClass: 'danger',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await logoutAlert.present();
    
  }

  async syncTransitUser() {
    const beginSyncAlert = await this.alertCtrl.create({
      header: 'Start Sync',
      message: `Please confirm that you want to begin sync process. `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          cssClass: 'danger',
          handler: () => {
            this.shared.beginSyncTask();
          }
        }
      ]
    });

    await beginSyncAlert.present();
  }

  async syncFromServerTransitUser() {
    const beginSyncAlert = await this.alertCtrl.create({
      header: 'Start Sync',
      message: `Please confirm that you want to begin sync process. `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          cssClass: 'danger',
          handler: () => {
            this.shared.beginSyncFromServerTask();
          }
        }
      ]
    });

    await beginSyncAlert.present();
  }

  /**
   * Call a service manually if there is a response 
   * then update the subject { shared.isOnline$ }
   * the whole process should run automatically.
   */
  manualSyncToServer() {
    this.shared.checkIsOnline().subscribe((data: any) => {
      if (data.status && data.status === 'OK') {
        this.shared.isOnline$.next(true);
      }
    }, error => {
      this.showNotOnlineMsg();
    })
  }

  async showNotOnlineMsg() {
    const beginSyncAlert = await this.alertCtrl.create({
      header: 'Offline',
      message: 'It seems you are offline. Please visit a hotspot nearby to sync',
      buttons: [
        {
          text: 'Try again',
          handler: () => this.manualSyncToServer()
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await beginSyncAlert.present();
  }

  logout() {
    this.shared.removeUserFromStorage().subscribe(response => {
      console.log(response);
      this.shared.LoggedInUser$.next(null);
      this.router.navigateByUrl('/login');
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('Tabs destroying ...');
    if (this.observeLoggedInUserSubscription) this.observeLoggedInUserSubscription.unsubscribe();
    this.chatService.ContactsList$.next([]);
    this.chatService.InteractionsList$.next([]);
  }

}
