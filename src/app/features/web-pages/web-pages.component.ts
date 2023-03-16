import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../services/app.service";
import { Title } from "@angular/platform-browser";
import { GridDataComponentBase } from "../../helpers/grid.data.component.base";
import { Location } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { FilterService, GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { ServiceStatus, WebPageClient, WebPageMerchantType } from "../../services/admin.api.client";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { CheckCompanyNumberComponent } from "../../shared/components/check-company-number/check-company-number.component";
import { DialogService } from "@progress/kendo-angular-dialog";
import * as moment from "moment";
import { DownloadService } from "../../services/download.service";

@Component({
    selector: 'app-web-pages',
    templateUrl: './web-pages.component.html',
    styleUrls: ['./web-pages.component.scss']
})
export class WebPagesComponent extends GridDataComponentBase implements OnInit, OnDestroy {
    readonly webPageTypeDropDownData: ReadonlyArray<{ key: string, type: WebPageMerchantType }> = Object.freeze([
        { key: '', type: undefined },
        { key: 'სტანდარტული', type: WebPageMerchantType.Standart },
        { key: 'მასტერი', type: WebPageMerchantType.Master },
        { key: 'ჩაილდი', type: WebPageMerchantType.Child },
    ]);
    readonly webPageStatusDropDownData: ReadonlyArray<{ key: string, status: ServiceStatus }> = Object.freeze([
        { key: '', status: undefined },
        { key: 'აქტიური', status: ServiceStatus.Accepted },
        { key: 'დაბლოკილი', status: ServiceStatus.Blocked },
        { key: 'გაუქმებული', status: ServiceStatus.Declined },
        { key: 'მუშავდება', status: ServiceStatus.Pending }
    ]);
    public gridView: GridDataResult;
    isLoading = false;
    @ViewChild('gridComponent', { static: true }) grid: GridComponent;
    private routerSubscription: Subscription;

    isPayByLinkEnabledDropDownList: ReadonlyArray<{ key: string, isPayByLinkEnabled: boolean }> = [
        { key: '', isPayByLinkEnabled: null },
        { key: 'კი', isPayByLinkEnabled: true },
        { key: 'არა', isPayByLinkEnabled: false },
    ]

    constructor(
        private webPageClient: WebPageClient,
        private appService: AppService,
        private titleService: Title,
        public location: Location,
        public router: Router,
        public dialogService: DialogService,
        private download: DownloadService,
        private filterService: FilterService,
    ) {
        super(
            {
                field: 'dateCreated',
                dir: 'desc'
            },
            location, router);
        this.titleService.setTitle('ვებ-გვერდები');
        this.filterService.changes
            .subscribe(r => {
                this.change(this.state);
                this.dataLoaderSubject.next();
            });
        this.dataLoaderSubscription = this.dataLoaderObservable()
            .pipe(switchMap(() => {
                this.isLoading = true;
                return this.webPageClient.queryWebPages(
                    this.getByField('address'),
                    this.getByField('companyName'),
                    this.getByField('companyIdentificationNumber'),
                    this.getByField('status'),
                    this.getByField('type'),
                    parseInt(this.getByField('limitStatus')),
                    this.getByField('externalMerchantId'),
                    this.getByField('tradeName'),
                    this.getByField('isPayByLinkEnabled'),
                    this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
                    this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined,
                    this.state.sort[0].dir,
                    this.state.sort[0].field,
                    this.state.skip / this.state.take,
                    this.state.take,
                )
            }))
            .subscribe(res => {
                this.isLoading = false;
                this.gridView = { data: res.data, total: res.totalCount };
            }, error => {
                throw error;
            })
    }

    ngOnInit() {
        super.initializeGrid(this.grid);
        this.appService.setTitle('ვებ-გვერდები');
        this.dataLoaderSubject.next();
        this.routerSubscription = this.router.events
            .subscribe(route => {
                if (route instanceof NavigationEnd) {
                    this.dataLoaderSubject.next();
                }
            })
    }

    openDialog() {
        this.dialogService.open({
            title: 'შეამოწმე კომპანია',
            content: CheckCompanyNumberComponent
        })
            .result.subscribe((r: { primary: boolean, response }) => {
                if (r.primary) {
                    const params = {
                        juridicalName: r.response.juridicalName,
                        identificationNumber: r.response.identificationNumber,
                        id: r.response.id
                    };
                    this.router.navigate([`/webpages/registerWebPage`], { queryParams: params })
                        .then()
                        .catch(e => {
                            throw e;
                        })
                }
            })
    }

    exportWebpages(): void {
        this.webPageClient.exportMerchants(
            this.getByField('address'),
            this.getByField('companyName'),
            this.getByField('companyIdentificationNumber'),
            this.getByField('status'),
            this.getByField('type'),
            parseInt(this.getByField('limitStatus')),
            this.getByField('externalMerchantId'),
            this.getByField('tradeName'),
            this.getByField('isPayByLinkEnabled'),
            this.getByField('createdAtFrom') ? moment(this.getByField('createdAtFrom')) : undefined,
            this.getByField('createdAtTo') ? moment(this.getByField('createdAtTo')) : undefined,
        ).subscribe(r => {
                this.download.download(r);
            }, error => {
                console.log(error);
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription
            .unsubscribe();
    }
}
