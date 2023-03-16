import { Component, Input, OnInit } from '@angular/core';
import { AppService } from "../services/app.service";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {
  show: boolean;
  @Input() useName: string;

  constructor(private userService: UserService, private appService: AppService) {
  }

  ngOnInit() {
    this.appService.showObs.subscribe(show => this.show = show);
  }

  logout() {
    this.userService.logOut();
  }

  navBarToggle() {
    this.appService.navBarToggle(!this.show);
  }
}
