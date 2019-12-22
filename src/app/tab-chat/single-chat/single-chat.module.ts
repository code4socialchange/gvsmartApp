import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SingleChatPage } from './single-chat.page';
import { InteractionComponent } from './../../components/chat/interaction/interaction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [
    SingleChatPage,
    InteractionComponent
  ]
})
export class SingleChatPageModule {}
