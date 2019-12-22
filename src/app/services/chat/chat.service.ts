import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Plugins } from '@capacitor/core';
import { SharedService } from '../shared/shared.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { getContactsResponse, User, Interaction } from '../interface.service';
const { Storage } = Plugins;

/**
 * Interactions are stored as { interactions_userId_villageId } as Array;
 */

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  ContactsList$: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([]);

  InteractionsList$: BehaviorSubject<Array<Interaction>> = new BehaviorSubject<Array<Interaction>>([]);

  constructor(private http: HttpClient) { }

  /**
   * This function will go through all interactions in Storage
   * and fetch the last interaction and store it into the InteractionsList$
   */
  prepareInteractions(): Observable<Array<Interaction>> {
    return Observable.create(observer => {
      Storage.keys().then(async response => {
        const interactionKeys = response.keys.filter(key => key.includes('interaction_'));
        console.log(interactionKeys);
        
        const interactionList = [];
        interactionKeys.map(key => {
          interactionList.push(Storage.get({ key: key }));
        });
  
        Promise.all(interactionList).then(responseList => {
          const interactionList: Array<Interaction> = responseList.map(data => {
            const list: Array<any> = JSON.parse(data.value);
            return list[list.length - 1];
          });
          this.InteractionsList$.next(interactionList);
          observer.next(interactionList);
          observer.complete();
        });
  
      })
    })
  }

  addNewToInteractionList(interaction: Interaction) {
    const filterInteractions = this.InteractionsList$.value.filter(i => i.senderId === interaction.senderId);
    const newInteractionsList = [interaction].concat(filterInteractions);
    this.InteractionsList$.next(newInteractionsList);
  }

  /**
   * Get all users excluding admins and same village
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

  /**
   * Will save interaction to Storage after extracting the interaction from Storage and pushing to the same array.
   * @param userId 
   * @param villageId 
   * @param interaction 
   */
  saveInteractionToStorage(userId: number, villageId: number, interaction: Interaction) : Observable<Interaction> {
    return Observable.create(observer => {
      Storage.get({ key: `interaction_${userId}_${villageId}` }).then(async response => {
        if (response.value) {
          const interactions: Array<Interaction> = JSON.parse(response.value);
          interactions.push(interaction);
          await Storage.set({ key: `interaction_${userId}_${villageId}`, value: JSON.stringify(interactions) });

          this.addNewToInteractionList(interaction);

          observer.next(interaction);
          observer.complete();
        } else {
          await Storage.set({ key: `interaction_${userId}_${villageId}`, value: JSON.stringify([interaction]) });
          
          this.addNewToInteractionList(interaction);
          
          observer.next(interaction);
          observer.complete();
        }
      })
    })
  }

  loadInteractionsFromUserID(userId: number, villageId) : Observable<Array<Interaction>> {
    return Observable.create(observer => {
      Storage.get({ key: `interaction_${userId}_${villageId}` }).then(response => {
        let responseArr = [];
        if (response.value) {
          responseArr = JSON.parse(response.value);
        }
        observer.next(responseArr);
        observer.complete();
      });
    })
  }

  async updateInteractionInStorage(interactionKeys: Array<string>) {

    return new Promise((resolve, reject) => {
      try {
        interactionKeys.map(async key => {
          const interactions = await Storage.get({ key: key });
          interactions.value = JSON.parse(interactions.value);

          const newInteractions: Array<Interaction> = interactions.value as any;
          newInteractions.map(interaction => {
            interaction.synced = true;
          })

          await Storage.set({
            key: key,
            value: JSON.stringify(newInteractions)
          });

        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
      
    });

  }

}
