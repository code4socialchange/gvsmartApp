import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { LoginRequest, LoginResponse, User, BlogResponse, BlogListResponse, Interaction } from '../interface.service';
import { Observable, from, BehaviorSubject } from 'rxjs';

import { Plugins, Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { map } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { ChatService } from '../chat/chat.service';
const { Storage, App, BackgroundTask } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  public static Links = {
    status: 'api/status',
    login: 'api/auth',
    usersList: 'api/user',
    blog: 'api/blog',
    message: 'api/message',
    sync: 'api/sync'
  }

  LoggedInUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  isOnline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private loadingController: LoadingController, private alertController: AlertController, private injector: Injector) { 
    this.getUserFromStorage().then(response => {
      this.LoggedInUser$.next(response);
    });
  }

  checkIsOnline() {
    return this.http.get(SharedService.Links.status);
  }

  /**
   * Sync all the pending chats to server.
   * All chats will have a key named -> { synced: boolean }
   * all the false values need to be taken and pushed 
   */
  async syncToServerTask() {
    console.info('Starting Sunc...');

    const loadingNotification = await this.loadingController.create({
      message: 'Syncing to server...',
      animated: true
    });

    try {

      const chatService = this.injector.get(ChatService)

      await loadingNotification.present();

      const keyList = await Storage.keys();
      const interactionKeys: Array<string> = keyList.keys.filter(key => key.includes('interaction_'));

      const InteractionsToBeSynced: Array<Interaction> = [].concat.apply([], await this.getInteractions(interactionKeys));

      console.log('To be synced ', InteractionsToBeSynced);

      if (InteractionsToBeSynced.length > 0) {
        await this.syncInteractionsToServer(InteractionsToBeSynced).toPromise();
        await chatService.updateInteractionInStorage(interactionKeys);
        chatService
        loadingNotification.dismiss();
      } else {
        loadingNotification.dismiss();
      }
      
    } catch (error) {
      loadingNotification.dismiss();

      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Error while syncing. Please try again later.',
        buttons: ['OK']
      });
      await alert.present();
    }

  }

  syncInteractionsToServer(interactions: Array<Interaction>) {
    return this.http.post(SharedService.Links.message, { messages: interactions });
  }

  authenticate(user: LoginRequest) : Observable<LoginResponse> {
    user.source = 'offline';
    return this.http.post<LoginResponse>(SharedService.Links.login, user);
  }

  async saveUserToStorage(user: User) {
    this.LoggedInUser$.next(user);
    return Storage.set({
      key: 'user',
      value: JSON.stringify(user)
    })
  }

  async getUserFromStorage() : Promise<User> {
    const user = await Storage.get({ key: 'user' });
    return JSON.parse(user.value);
  }

  removeUserFromStorage() : Observable<void> {
    return from(Storage.clear())
  }

  async saveTokenToStorage(token: string) {
    return Storage.set({
      key: 'token',
      value: token
    })
  }

  async getTokenFromStorage() : Promise<string> {
    const token = await Storage.get({ key: 'token' });
    return token.value;
  }

  getTokenFromStorageObservable() : Observable<string> {
    return from(this.getTokenFromStorage());
  }

  getArticles() : Observable<BlogListResponse> {
    if (this.isOnline$.value) return this.http.get<BlogListResponse>(SharedService.Links.blog);
    else return this.getArticlesFromStorage();
  }

  getArticle(blogId: number) : Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${SharedService.Links.blog}/${blogId}`);
  }

  async saveArticlesToStorage(blogResponse: BlogListResponse) {
    await Storage.set({
      key: 'articles',
      value: JSON.stringify(blogResponse)
    })
  }

  getArticlesFromStorage() : Observable<BlogListResponse> {
    return Observable.create(observer => {
      Storage.get({ key: 'articles' }).then(data => {
        if (data.value) {
          data = JSON.parse(data.value);
          observer.next(data);
          observer.complete();
        } else {
          observer.next({
            blogs: [],
            success: true
          })
        }
      });
    })
  }

  syncLocal(data = null) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post(SharedService.Links.sync, { unsyncedData: data }, { headers, responseType: 'text' });
  }

  syncFromServer(data) {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post(SharedService.Links.sync, { fileData: data });
  }

  async getInteractions(interactionKeys: Array<string>): Promise<any> {

    return Promise.all(interactionKeys.map(async key => {
      let interactions = await Storage.get({ key: key });
      interactions.value = JSON.parse(interactions.value);

      if (Array.isArray(interactions.value)) {
        const listToSync = interactions.value.filter(interaction => !interaction.synced);
        return listToSync;
      }
    }));

  }

  /**
   * Read and return the file data received from Online Server
   */
  async readUnSyncFromServerFile() {
    try {
      const unsyncedFile = await Filesystem.readFile({
        path: 'unsyncFromServer.txt',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      return Promise.resolve(unsyncedFile.data)
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  /**
   * Read and return the file data received from Local Server
   */
  async readLocalSyncToServerFile() : Promise<any> {
    try {
      const syncToServer = await Filesystem.readFile({
        directory: FilesystemDirectory.Documents,
        path: 'syncToServer.txt',
      });
      return Promise.resolve(syncToServer.data);
    } catch (error) {
      return Promise.resolve(null)
    }
  }

  async beginSyncTask() {

    const syncLoader = await this.loadingController.create({
      message: 'Syncing in progress...',
      animated: true
    });

    try {
      
      await syncLoader.present();

      // Checking if unsyncedFile exists.
      const unsyncedFile = await this.readUnSyncFromServerFile()
        
      this.syncLocal(unsyncedFile).subscribe(async (response: any) => {
        
        if (unsyncedFile) {
          await Filesystem.writeFile({
            path: 'syncToServer.txt',
            data: response,
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
          })
        }
        
        syncLoader.dismiss();

      }, error => {
        syncLoader.dismiss();
      })

    } catch (error) {
      syncLoader.dismiss();
    }
    
  }

  async beginSyncFromServerTask() {

    const syncLoader = await this.loadingController.create({
      message: 'Syncing in progress...',
      animated: true
    });

    try {
      
      await syncLoader.present();

      const syncToServerFile = await this.readLocalSyncToServerFile();
      
      this.syncFromServer(syncToServerFile).subscribe(async (response: any) => {
        
        if (response.dataToSync) {
          await Filesystem.writeFile({
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8,
            path: 'unsyncFromServer.txt',
            data: response.dataToSync
          });
        }

        // Since the sync task is completed. Can DELETE syncToServer.txt file.
        if (syncToServerFile) {
          await Filesystem.deleteFile({
            directory: FilesystemDirectory.Documents,
            path: 'syncToServer.txt'
          });
        }

        syncLoader.dismiss();

      }, err => {
        syncLoader.dismiss();    
      });

    } catch(err) {
      syncLoader.dismiss();
    }

  }

}


/**
 * 
 * Sync Concept -> 
 *  
 *  Local Server
 *        - Sync from Local Server
 *        - Data is saved in phone
 *
 *  Online Server
 *        - Send sync data to server
 *        - Delete local data
 *        - Receives new unsynced data
 *  
 *  Local Server
 *        - if (has data on phone)
 *        - Sync it to Server
 *        - Delete local data
 *        - End
 */