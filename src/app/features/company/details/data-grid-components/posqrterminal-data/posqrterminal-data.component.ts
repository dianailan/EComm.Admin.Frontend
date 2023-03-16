import { Component, Input, Output, OnInit } from "@angular/core";
import {
  ServiceStatus,
  PosQRDetails,
  PosQRClient
} from "../../../../../services/admin.api.client";
import { Subject } from "rxjs";
import { Clipboard } from '@angular/cdk/clipboard';
import { OpenSnackbarService } from "src/app/services/open-snackbar.service";

@Component({
  selector: 'app-posqrterminal-data',
  templateUrl: './posqrterminal-data.component.html',
  styleUrls: ['./posqrterminal-data.component.scss']
})
export class PosqrterminalDataComponent implements OnInit {
  @Input() gridData: PosQRDetails[];
  @Input() isCompanyCanceled: boolean;
  @Output() changeStatusSubject: Subject<{ id: number, status: ServiceStatus }> = new Subject<{ id: number, status: ServiceStatus }>();
  isLoading = false;
  public opened = false;
  clientId: string = '';
  clientSecret: string = '';

  constructor(private clipboard: Clipboard, private posQrClient: PosQRClient, private snackBar: OpenSnackbarService) { }

  updatePosQrTerminalStatus(id: number, status: ServiceStatus,) {
    this.changeStatusSubject.next({ id, status })
  }

  public close(): void {
    this.opened = false;
  }

  public open(id: number): void {
    this.opened = true;

    this.posQrClient.clientSecret(id).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    });
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
    this.snackBar.openSnackBarSuccess('Client Secret დაკოპირებულია');
  }

  copyId() {
    this.clipboard.copy(this.clientId);
    this.snackBar.openSnackBarSuccess('Client ID დაკოპირებულია');
  }

  ngOnInit(): void {
  }
}
