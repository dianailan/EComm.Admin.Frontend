import { Component } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
import { AppService } from "./services/app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tpayadmin';

  constructor(private router: Router, private appService: AppService) {
    this.router.events.subscribe(r => {
      if (r instanceof NavigationStart) {
        this.appService.setUrl('')
      }
    })
  }
}
