import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, User } from '../interface.service';
import { Observable, from, BehaviorSubject } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isOnline: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) { }

  public static Links = {
    login: 'api/auth',
    usersList: 'api/user'
  }

  authenticate(user: LoginRequest) : Observable<LoginResponse> {
    user.source = 'offline';
    return this.http.post<LoginResponse>(SharedService.Links.login, user);
  }

  async saveUserToStorage(user: User) {
    await Storage.set({
      key: 'user',
      value: JSON.stringify(user)
    })
  }

  async getUserFromStorage() : Promise<User> {
    const user = await Storage.get({ key: 'user' });
    return JSON.parse(user.value);
  }

  async saveTokenToStorage(token: string) {
    await Storage.set({
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

}
