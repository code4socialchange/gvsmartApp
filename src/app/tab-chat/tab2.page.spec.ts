import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { tab-chatPage } from './tab-chat.page';

describe('tab-chatPage', () => {
  let component: tab-chatPage;
  let fixture: ComponentFixture<tab-chatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [tab-chatPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(tab-chatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
