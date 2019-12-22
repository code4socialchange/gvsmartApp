import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { SingleChatPage } from './single-chat/single-chat.page';
import { ChatService } from '../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { Interaction, User } from '../services/interface.service';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-tab-chat',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  prepareInteractionSubscription: Subscription;
  interactionsList: Array<Interaction> = [];

  UserLoggedIn: User;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private chatService: ChatService, private shared: SharedService) { }

  async ngOnInit() {
    this.UserLoggedIn = await this.shared.getUserFromStorage();
    this.prepareInteractionSubscription = this.chatService.prepareInteractions().subscribe(interactionsList => {
      console.log(interactionsList);
      this.interactionsList = interactionsList;
    });
    this.observeNewInteractions();
  }

  observeNewInteractions() {
    this.chatService.InteractionsList$.subscribe(interactions => {
      const oldInteractions = this.interactionsList.map(i => new Date(i.createdAt).getTime());
      const newInteractions = interactions.map(i => new Date(i.createdAt).getTime());

      if (oldInteractions.toString() === newInteractions.toString()) {
        return;
      };

      this.interactionsList = interactions;

    })
  }

  getUser(interaction: Interaction) {
    const userLoggedIn = this.UserLoggedIn;
    const contactList = this.chatService.ContactsList$.value;

    let senderId = interaction.senderId;
    if (senderId === userLoggedIn.id) senderId = interaction.receiverId;

    const userToShow = contactList.find(user => user.id === senderId)

    if (userToShow) return `${userToShow.firstName} ${userToShow.lastName}`;
    else return '';
    
  }

  async openChat(interaction: Interaction) {
    
    const usersList = this.chatService.ContactsList$.value;
    const contact = usersList.find(i => i.id === interaction.receiverId);
    
    const singleChatModal = await this.modalCtrl.create({
      component: SingleChatPage,
      componentProps: {
        contact: contact
      }
    })

    return await singleChatModal.present();

  }

  async loadContacts() {
    const contactsModal = await this.modalCtrl.create({
      component: ContactsComponent
    });

    contactsModal.onWillDismiss().then(modal => {
      if (modal.data) this.openChatFromContact(modal.data);
    })

    return await contactsModal.present();
  }

  async openChatFromContact(contact) {
  
    const singleChatModal = await this.modalCtrl.create({
      component: SingleChatPage,
      componentProps: {
        contact: contact
      }
    })

    return await singleChatModal.present();
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.prepareInteractionSubscription) this.prepareInteractionSubscription.unsubscribe(); this.chatService.InteractionsList$.next([]);
  }

}
