import { Injectable } from "@angular/core";
import {
  SnackBarConfig,
  SnackBarHorizontalPosition,
  SnackBarService,
  SnackBarVerticalPosition
} from "@tbc-common/snack-bar";

@Injectable({
  providedIn: 'root'
})

export class OpenSnackbarService {
  constructor(public snackbar: SnackBarService) {
  }

  openSnackBarSuccess(text): void {
    const config = new SnackBarConfig();
    config.horizontalPosition = SnackBarHorizontalPosition.CENTER;
    config.verticalPosition = SnackBarVerticalPosition.TOP;
    config.panelClass = 'snackbar-success';
    config.duration = 3000;
    this.snackbar.open(text, 'დახურვა', config);
  }

  openSnackBarDanger(text): void {
    const config = new SnackBarConfig();
    config.horizontalPosition = SnackBarHorizontalPosition.CENTER;
    config.verticalPosition = SnackBarVerticalPosition.TOP;
    config.panelClass = 'snackbar-danger';
    config.duration = 3000;
    this.snackbar.open(text, 'დახურვა', config);
  }
}
