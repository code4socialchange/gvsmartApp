import { Component } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private chatService: ChatService, private sqlite: SQLite) {}

  ngOnInit() {
    this.initDB();
    this.chatService.getContacts();
  }

  initDB() {

    console.log('Creating DB ....');

    this.sqlite.create({
      name: 'gv-smart',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('DB created or opened successfully ', db); 
      }).catch(err => {
        console.error('Error creating or opening db ', err);
      })
  }

}
