import { Component, OnInit } from '@angular/core';
import { AppService } from "../services/app.service";

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {
  title: string;
  url: string;

  constructor(
    private appService: AppService,
  ) {
    this.appService.getTitle()
      .subscribe(appTitle => this.title = appTitle);
    this.appService.getUrl()
      .subscribe(url => this.url = url);
  }

  ngOnInit() {
  }
}
