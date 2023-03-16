import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  show: boolean;
  @Input() loadNavBar = false;
  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.appService.showObs.subscribe(show => this.show = !show);
  }
}
