import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { User, Interaction } from 'src/app/services/interface.service';
import { NavParams } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared/shared.service';

import { Plugins, CameraResultType, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
const { Camera, Photos, Filesystem } = Plugins;

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.page.html',
  styleUrls: ['./single-chat.page.scss'],
})
export class SingleChatPage implements OnInit {

  @Input() contact: User;
  interactions: Array<Interaction> = [];

  interactionForm: FormGroup;

  user: User;

  constructor(private shared: SharedService, private chatService: ChatService) { }

  async ngOnInit() { 
    this.interactionForm = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
    this.user = await this.shared.getUserFromStorage()
    this.loadInteractions();
  }
  
  loadInteractions() {
    console.log('Loading interactions for user -> ', this.contact.id);
    this.chatService.loadInteractionsFromUserID(this.contact.id, this.contact.VillageId).subscribe(interactions => {
      this.interactions = interactions;
    });
  }

  trackByFn(index) {
    return index;
  }

  getInteractionType(interaction: Interaction) {
    if (interaction.senderId === this.user.id) return 'sent'
    else return 'received';
  }

  async submitInteractionForm() {
    if (this.interactionForm.invalid) return;
    
    const formValue = this.interactionForm.value;
    await this.saveInteractionToStorage(formValue.message, 'text');

    this.interactionForm.reset();

  }

  async saveInteractionToStorage(message: string, type: 'text' | 'image') {

    try {
      
      const user = await this.shared.getUserFromStorage();
  
      // const base64String = await Filesystem.readFile({
      //   path: message
      // })
  
      // console.log(base64String)
  
      const interaction: Interaction = {
        message: message,
        senderId: user.id,
        receiverId: this.contact.id,
        messageType: type,
        imagePath: message,
        received: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false
      };
  
      const newInteraction = await this.chatService.saveInteractionToStorage(this.contact.id, this.contact.VillageId, interaction).toPromise();
      console.log(newInteraction);
  
      this.interactions.push(newInteraction);

    } catch (error) {
      
      console.error(error);

    }

  }

  sendFromGallery() {
    
  }

  async sendFromCamera() {

    try {
  
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        width: 300
      });
      
      console.log('Image Length ', image.path);

      await this.saveInteractionToStorage(image.path, 'image');

    } catch (error) {
      console.error('Error opening camera ', error);
    }


  }
  
}
