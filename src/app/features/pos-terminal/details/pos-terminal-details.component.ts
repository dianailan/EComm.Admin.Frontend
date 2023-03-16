import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CompanyClient,
  PosQRTerminalClient,
  DetailsPosQRTerminal,
  PosQRClient,
} from "../../../services/admin.api.client";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";
import { forkJoin } from "rxjs";
import { AppService } from "../../../services/app.service";
import { Title } from "@angular/platform-browser";
import { ConfirmActionComponent } from "../../../shared/components/confirm-action/confirm-action.component";
import { DialogAction, DialogService } from "@progress/kendo-angular-dialog";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-pos-terminal-details',
  templateUrl: './pos-terminal-details.component.html',
  styleUrls: ['./pos-terminal-details.component.scss']
})
export class PosTerminalDetailsComponent implements OnInit {
  formGroup: FormGroup;
  posQrTerminalDetails: DetailsPosQRTerminal;
  editMode = false;
  public posQrTerminalId: number;
  submitted = false;
  public opened = false;
  clientId: string = '';
  clientSecret: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyClient: CompanyClient,
    private posQrTerminalClient: PosQRTerminalClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private appService: AppService,
    private titleService: Title,
    private dialogService: DialogService,
    private posQrClient: PosQRClient,
    private clipboard: Clipboard
  ) {
    this.titleService.setTitle('POS QR Terminal | დეტალები');

    this.activatedRoute.params.subscribe(p => {
      this.posQrTerminalId = p.id;
      this.appService.setUrl(`/posterminal/${this.posQrTerminalId}/logs`)
    });

    this.formGroup = this.formBuilder.group({
      terminalNo: [''],
      physicalTerminalNo: ['', [Validators.required]],
      isBnplEnabled: ['', [Validators.required]],
      id: ['']
    });

    this.getPosQrTerminalDetails()
  }
  public close(): void {
    this.opened = false;
  }

  public open(): void {
    this.opened = true;

    this.posQrClient.clientSecret(this.posQrTerminalDetails.posQrMerchantId).subscribe(res => {
      this.clientId = res.clientId;
      this.clientSecret = res.clientSecret;
    });
  }

  copySecret() {
    this.clipboard.copy(this.clientSecret);
    this.snackBar.openSnackBarSuccess('Client Secret დაკოპირებულია')
  }

  copyId() {
    this.clipboard.copy(this.clientId);
    this.snackBar.openSnackBarSuccess('Client ID დაკოპირებულია')
  }

  ngOnInit(): void {
    this.appService.setTitle('POS QR Terminal | დეტალები');
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  private setFormGroupValue() {
    try {
      this.formGroup.setValue({
        terminalNo: this.posQrTerminalDetails.terminalNo,
        physicalTerminalNo: this.posQrTerminalDetails.physicalTerminalNo,
        isBnplEnabled: this.posQrTerminalDetails.isBnplEnabled,
        id: this.posQrTerminalId
      });
    } catch (e) {
      console.log(e)
    }
  }

  updatePosQrTerminal() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.posQrTerminalClient.updatePosQRTerminal(this.formGroup.value)
      .subscribe(res => {
        this.getPosQrTerminalDetails();
        this.editMode = !this.editMode;
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }

  private getPosQrTerminalDetails() {
    forkJoin([
      this.posQrTerminalClient.getPosQRTerminal(this.posQrTerminalId)])
      .subscribe(r => {
        this.posQrTerminalDetails = r[0];
        this.setFormGroupValue();
      });
  }

  updatePosQrTerminalStatus(id, status) {
    if (status === 2) {
      const dialogRef = this.dialogService.open({
        title: 'Pos Qr Terminal-ის გაუქმება',
        content: ConfirmActionComponent,
        width: 400
      });
      dialogRef.content.instance.message = '';
      dialogRef
        .result
        .subscribe((r: DialogAction) => {
          if (r.primary) {
            this.posQrTerminalClient.changePosQRTerminalStatus(id, status)
              .subscribe(r => {
                this.getPosQrTerminalDetails();
              }, error => {
                this.snackBar.openSnackBarDanger(error.result.message);
              })
          }
        })
      return;
    }
    this.posQrTerminalClient.changePosQRTerminalStatus(id, status)
      .subscribe(r => {
        this.getPosQrTerminalDetails();
      }, error => {
        this.snackBar.openSnackBarDanger(error.result.message);
      })
  }
}
