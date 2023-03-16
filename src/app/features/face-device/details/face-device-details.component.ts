import { Component } from "@angular/core";
import { FaceDeviceClient, FaceDeviceDetails, FaceDeviceStatus } from "../../../services/admin.api.client";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AppService } from "../../../services/app.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { OpenSnackbarService } from "../../../services/open-snackbar.service";

@Component({
  selector: 'app-face-device-details',
  templateUrl: './face-device-details.component.html',
  styleUrls: ['./face-device-details.component.scss']
})

export class FaceDeviceDetailsComponent {
  formGroup: FormGroup;
  editMode = false;
  submitted = false;
  faceDeviceDetails: FaceDeviceDetails;
  public faceDeviceId: number;
  readonly deviceStatuses: ReadonlyArray<{ id: FaceDeviceStatus, value: string }> = Object.freeze([
    { id: FaceDeviceStatus.Active, value: 'აქტიური' },
    { id: FaceDeviceStatus.Blocked, value: 'დაბლოკილი' },
    { id: FaceDeviceStatus.Free, value: 'თავისუფალი' },
    { id: FaceDeviceStatus.Lost, value: 'დაკარგული' }
  ]);

  constructor(
    private faceDeviceClient: FaceDeviceClient,
    private formBuilder: FormBuilder,
    private snackBar: OpenSnackbarService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private appService: AppService) {
    this.titleService.setTitle('Face დივაისი | დეტალები');
    this.appService.setTitle('Face დივაისი | დეტალები');
    this.activatedRoute.params.subscribe(p => {
      this.faceDeviceId = p.id;
      this.appService.setUrl(`/facedevice/${this.faceDeviceId}/logs`);
      this.getFaceDeviceDetails();
    });
    this.formGroup = this.formBuilder.group({
      id: [this.faceDeviceId],
      comment: ['', [Validators.max(512)]],
      status: ['', [Validators.required]]
    });

    this.getFaceDeviceDetails();
  }

  ngOnInit() {
  }

  private setFormGroupValue() {
    this.formGroup.setValue({
      id: this.faceDeviceId,
      comment: this.faceDeviceDetails.comment,
      status: this.faceDeviceDetails.deviceStatus
    });
  }

  setEditMode() {
    this.editMode = !this.editMode;
    this.submitted = false;
    if (!this.editMode) {
      this.setFormGroupValue();
    }
  }

  updateFaceDevice() {
    this.submitted = true;
    if (!this.formGroup.valid) {
      return;
    }
    this.faceDeviceClient.saveFaceDevice(this.formGroup.value)
      .subscribe(res => {
        this.getFaceDeviceDetails();
        this.editMode = !this.editMode;
      },
        error => {
          this.snackBar.openSnackBarDanger(error.result.message);
        });
  }

  private getFaceDeviceDetails(): void {
    this.faceDeviceClient.getFaceDevice(this.faceDeviceId)
      .subscribe((r: FaceDeviceDetails) => {
        this.faceDeviceDetails = r;
        this.setFormGroupValue();
      });
  }
}
