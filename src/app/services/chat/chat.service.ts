import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Plugins } from '@capacitor/core';
import { SharedService } from '../shared/shared.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { getContactsResponse, User } from '../interface.service';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  ContactsList$: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);

  constructor(private http: HttpClient) { }

  

  /**
   * Get all users excluding admins
   */
  getContacts() {
    this.http.get<getContactsResponse>(SharedService.Links.usersList).subscribe(response => {
      this.saveContactsToStorage(response.users);
    });
  }

  async saveContactsToStorage(users: Array<User>) {
    const activeUsers = users.filter(user => user.active)
    this.ContactsList$.next(activeUsers);
    await Storage.set({
      key: 'contacts',
      value: JSON.stringify(activeUsers)
    })
  }

  async getContactsFromStorage() {
    return Storage.get({ key: 'contacts' });
  }

}
