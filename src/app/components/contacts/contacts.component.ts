import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/interface.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {

  usersList: Array<User> = [];
  filteredUsersList: Array<User> = [];

  constructor(private chatService: ChatService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.chatService.getContactsFromStorage().then(users => {
      this.usersList = JSON.parse(users.value);
      this.filteredUsersList = JSON.parse(users.value);
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  filterContacts(filterText: string) {
    filterText = filterText.toLowerCase();
    console.log('Searching ', filterText);
    requestAnimationFrame(() => {
      this.filteredUsersList = this.usersList.filter(user => (user.firstName + user.lastName).includes(filterText));
    })
  }

  openSingle(contact) {
    this.modalCtrl.dismiss(contact);
  }

}
