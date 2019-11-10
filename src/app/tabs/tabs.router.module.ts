import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'home',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-home/tab1.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'tab-chat',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-chat/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab-news',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab-news/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/tab-home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
