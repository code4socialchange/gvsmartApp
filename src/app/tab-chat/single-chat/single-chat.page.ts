import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat/chat.service';
import { User } from 'src/app/services/interface.service';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {

  usersList: Array<User>;

  constructor(private router: Router, private chatService: ChatService) { 
    console.log(this.router.getCurrentNavigation().extras.state)
  }

  ngOnInit() { 
    this.chatService.getContactsFromStorage().then(users => {
      this.usersList = JSON.parse(users.value);
    });
  }

}
