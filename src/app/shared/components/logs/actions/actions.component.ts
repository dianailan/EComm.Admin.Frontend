import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-log-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})

export class ActionsComponent {
  @Input() fields;
}
