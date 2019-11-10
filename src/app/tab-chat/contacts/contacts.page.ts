import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/interface.service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  usersList: Array<User> = [];
  filteredUsersList: Array<User> = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getContactsFromStorage().then(users => {
      this.usersList = JSON.parse(users.value);
      this.filteredUsersList = JSON.parse(users.value);
    });
  }

  filterContacts(filterText: string) {
    filterText = filterText.toLowerCase();
    console.log('Searching ', filterText);
    requestAnimationFrame(() => {
      this.filteredUsersList = this.usersList.filter(user => (user.firstName + user.lastName).includes(filterText));
    })
  }

  openSingle(contact) {
    console.log(contact);
  }

}
