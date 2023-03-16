import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { AppService } from "src/app/services/app.service";
import {
  IdResponse,
  RegisterPosQRTerminal,
  PosQRTerminalClient
} from "src/app/services/admin.api.client";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { FormGroup } from "@angular/forms";
import { OpenSnackbarService } from "src/app/services/open-snackbar.service";
import { MerchantService } from "src/app/services/merchant.service";
import { Clipboard } from '@angular/cdk/clipboard'
import { PosQRClient } from "src/app/services/admin.api.client";
import { RegisterPosQrTerminalService } from "src/app/services/register-posqr-terminal.service";

@Component({
  selector: 'app-register-pos-terminal',
  templateUrl: './register-pos-terminal.component.html',
  styleUrls: ['./register-pos-terminal.component.scss']
})
export class RegisterPosTerminalComponent implements OnInit {
  public formSubmitEvent: Subject<boolean> = new Subject<boolean>();
  private posQrTerminalModel: RegisterPosQRTerminal;
  merchantExternalId: string;
  sentMerchantId: string;
  id: number;
  opened = false;
  clientSecret: any;
  clientId: any;
  submitted: boolean = false;

  constructor(
    private posQrTerminalClient: PosQRTerminalClient,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,
    private openSnackBar: OpenSnackbarService,
    private router: Router,
    private merchantService: MerchantService,
    private clipboard: Clipboard,
    private posQrClient: PosQRClient,
    private registerPosTerminalService: RegisterPosQrTerminalService
  ) {
    this.appService.setTitle('POS QR Terminal | რეგისტრაცია');

    this.merchantExternalId = this.activatedRoute.snapshot.queryParams.merchantId;
    this.id = this.activatedRoute.snapshot.queryParams.id;
  }

  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.posQrClient.clientSecret(this.id).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    })

    this.opened = true;
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
  }

  copyId() {
    this.clipboard.copy(this.clientId);
  }

  formSubmit(value?) {
    if (value == 'register') {
      this.submitted = true;
    }

    this.formSubmitEvent.next(true);
  }

  formSubmitSub(): Observable<any> {
    return this.formSubmitEvent.asObservable();
  }

  registerPosQrTerminal(event: FormGroup) {
    this.posQrTerminalModel = this.merchantService.buildModel(event.value);

    this.posQrTerminalClient.addPosQRTerminalRegister(this.merchantExternalId, this.posQrTerminalModel)
      .subscribe((r: IdResponse) => {
        if (this.submitted) {
          this.router.navigateByUrl(`posterminal/${r.id}`)
            .then()
            .catch(e => throwError(e))
        } else {
          this.openSnackBar.openSnackBarSuccess('ტერმინალი დაემატა წარმატებით')
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }, error => {
        this.openSnackBar.openSnackBarDanger(error.result.message);
      });
  }

  ngOnInit(): void {
    this.titleService.setTitle('POS QR Terminal');

    this.registerPosTerminalService.share.subscribe(val => {
      this.sentMerchantId = val
    })
  }
}
