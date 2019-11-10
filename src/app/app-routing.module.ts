import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { 
    path: 'login', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule) 
  },
  { 
    path: 'single-chat', 
    loadChildren: () => import('./tab-chat/single-chat/single-chat.module').then(m => m.SingleChatPageModule) 
  },
  { 
    path: 'contacts', 
    loadChildren: () => import('./tab-chat/contacts/contacts.module').then(m =>m.ContactsPageModule) 
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
