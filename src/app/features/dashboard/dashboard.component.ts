import { Component, OnInit } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private appService: AppService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Dashboard');
  }

  ngOnInit() {
    this.appService.setTitle('Dashboard');
  }
}
