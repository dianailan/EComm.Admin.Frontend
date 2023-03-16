import { Component, OnInit } from '@angular/core';
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";
import { PosQRTerminalClient } from "../../../services/admin.api.client";

@Component({
    selector: 'app-is-posqr-accepted',
    templateUrl: './is-posqr-accepted.component.html',
    styleUrls: ['./is-posqr-accepted.component.scss']
})
export class IsPosqrAcceptedComponent extends DialogContentBase implements OnInit {
    submitted = false;
    id: string
    posqrFound = {
        response: false,
        message: '',
        id: 0
    };

    constructor(
        public dialog: DialogRef,
        private terminalClient: PosQRTerminalClient
    ) {
        super(dialog);
    }

    ngOnInit() {
    }

    public onCancelAction(): void {
        this.dialog.close({ primary: false });
    }

    public onConfirmAction(event) {
        this.submitted = true;
        if (this.id !== null) {
            this.terminalClient.isPosQRMerchantAccepted(this.id)
                .subscribe((response) => {
                    if (!response.isMerchantAccepted) {
                        this.posqrFound.response = true;
                        this.posqrFound.message = 'დადასტურებული მერჩანტი ვერ მოიძებნა';
                    } else {
                        this.dialog.close({ primary: true, response, id: this.id });
                    }
                }, error => {
                    this.posqrFound.response = true;
                    this.posqrFound.message = 'დადასტურებული მერჩანტი ვერ მოიძებნა';
                })
        }
    }
}
