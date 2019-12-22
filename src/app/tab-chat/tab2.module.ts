import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ContactsComponent } from '../components/contacts/contacts.component';
import { SingleChatPageModule } from './single-chat/single-chat.module';
import { SingleChatPage } from './single-chat/single-chat.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SingleChatPageModule,
    RouterModule.forChild([
      { 
        path: '', 
        children: [
          {
            path: '',
            component: Tab2Page
          },
          // { 
          //   path:  'single',
          //   loadChildren: () => import('./single-chat/single-chat.module').then(m => m.SingleChatPageModule)
          // }
        ]
      }
    ])
  ],
  declarations: [
    Tab2Page,
    ContactsComponent
  ],
  entryComponents: [
    ContactsComponent,
    SingleChatPage
  ]
})
export class Tab2PageModule {}
