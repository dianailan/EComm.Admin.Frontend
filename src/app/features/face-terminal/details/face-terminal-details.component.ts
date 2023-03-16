import { Component } from "@angular/core";
import { FaceTerminalClient, FaceTerminalDetails, FaceTerminalStatus } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";

@Component({
  selector: 'app-face-terminal-details',
  templateUrl: './face-terminal-details.component.html',
  styleUrls: ['./face-terminal-details.component.scss']
})

export class FaceTerminalDetailsComponent {
  formGroup: FormGroup;
  editMode = false;
  submitted = false;
  faceTerminalDetails: FaceTerminalDetails;
  public faceTerminalId: number;
  readonly terminalStatuses: ReadonlyArray<{ id: FaceTerminalStatus, value: string }> = Object.freeze([
    { id: FaceTerminalStatus.Active, value: 'აქტიური' },
    { id: FaceTerminalStatus.Blocked, value: 'დაბლოკილი' },
    { id: FaceTerminalStatus.Deleted, value: 'გაუქმებული' },
    { id: FaceTerminalStatus.Lost, value: 'დაკარგული' }
  ]);

  IsMerchantNotDeclined: boolean;
  constructor(
    private faceTerminalClient: FaceTerminalClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService) {
    this.titleService.setTitle('Face პლანშეტი | დეტალები');
    this.appService.setTitle('Face პლანშეტი | დეტალები');
    this.activatedRoute.params.subscribe(p => {
      this.faceTerminalId = p.id;
      this.appService.setUrl(`/faceterminal/${this.faceTerminalId}/logs`);
      this.getFaceTerminalDetails();
    });
    this.formGroup = this.formBuilder.group({
      id: [this.faceTerminalId],
      comment: ['', [Validators.max(512)]],
      status: ['', [Validators.required]]
    });

    this.getFaceTerminalDetails();
  }

  ngOnInit() {
  }

  private setFormGroupValue() {
    this.formGroup.setValue({
      id: this.faceTerminalId,
      comment: this.faceTerminalDetails.comment,
      status: this.faceTerminalDetails.terminalStatus
    });
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  updateFaceTerminal() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.faceTerminalClient.saveFaceTerminal(this.formGroup.value)
      .subscribe(res => {
        this.getFaceTerminalDetails();
        this.editMode = !this.editMode;
      },
        error => {
          this.snackBar.openSnackBarDanger(error.result.message);
        });
  }

  private getFaceTerminalDetails(): void {
    this.faceTerminalClient.getFaceTerminal(this.faceTerminalId)
      .subscribe((r: FaceTerminalDetails) => {
        this.faceTerminalDetails = r;
        this.faceTerminalClient.isMerchantNotDeclined(this.faceTerminalId)
          .subscribe((r) => {
            this.IsMerchantNotDeclined = r;
          });

        this.setFormGroupValue();
      });
  }
}
