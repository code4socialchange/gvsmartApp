import { Component, OnInit, Input } from '@angular/core';
import { Interaction } from 'src/app/services/interface.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'chat-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss'],
})
export class InteractionComponent implements OnInit {

  /** sent or received */
  @Input() chatType: string; 

  @Input() interaction: Interaction;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    
  }

  safeImage(stringToSanitize) : SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(stringToSanitize);
  }

}
