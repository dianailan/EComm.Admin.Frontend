import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-action-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})

export class LogsComponent {
  @Input() gridView;
}
