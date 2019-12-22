import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logger: BehaviorSubject<{ desc: string, data: any }> = new BehaviorSubject<{ desc: string, data: any }>({ desc: null, data: null });

  constructor() { 
    this.logEvent();
  }

  logEvent() {
    this.logger.subscribe(data => {
      console.log(`${data.desc} ===> ${JSON.stringify(data.desc)}`);
    })
  }

}
