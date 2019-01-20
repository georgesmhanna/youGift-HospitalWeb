import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';

import {RequestsService} from 'app/main/requests/requests.service';
import {RequestsRequestFormDialogComponent} from 'app/main/requests/request-form/request-form.component';

@Component({
    selector: 'requests-request-list',
    templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RequestsRequestListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    requests: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'date', 'type', 'bloodType', 'quantity', 'description', 'replies', 'status', 'buttons'];
    selectedRequests: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    // Private
    private _unsubscribeAll: Subject<any>;
    private hospitals: any;

    /**
     * Constructor
     *
     * @param {RequestsService} _requestsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _requestsService: RequestsService,
        public _matDialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._requestsService);

        this._requestsService.onRequestsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(requests => {
                this.requests = requests;

                this.checkboxes = {};
                requests.map(request => {
                    this.checkboxes[request.id] = false;
                });
            });

        // this._requestsService.onHospitalsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(hospitals => {
        //         this.hospitals = hospitals;
        //
        //         this.checkboxes = {};
        //     });

        this._requestsService.onSelectedRequestsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRequests => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedRequests.includes(id);
                }
                this.selectedRequests = selectedRequests;
            });

        this._requestsService.onRequestDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._requestsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._requestsService.deselectRequests();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit request
     *
     * @param request
     */
    editRequest(request): void {
        this.dialogRef = this._matDialog.open(RequestsRequestFormDialogComponent, {
            panelClass: 'request-form-dialog',
            data: {
                request: request,
                action: 'edit',
                hospitals: this.hospitals,
                bloodTypes: this._requestsService.getBloodTypes()
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        console.log('edit data is ', formData.getRawValue());
                        const editData = formData.getRawValue();
                        delete editData.avatar;
                        this._requestsService.updateRequest(editData);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteRequest(request);

                        break;
                }
            });
    }

    /**
     * Delete Request
     */
    deleteRequest(request): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._requestsService.deleteRequest(request);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param requestId
     */
    onSelectedChange(requestId): void {
        this._requestsService.toggleSelectedRequest(requestId);
    }

    /**
     * Toggle star
     *
     * @param requestId
     */
    toggleStar(requestId): void {
        if (this.user.starred.includes(requestId)) {
            this.user.starred.splice(this.user.starred.indexOf(requestId), 1);
        }
        else {
            this.user.starred.push(requestId);
        }

        this._requestsService.updateRequestData(this.user);
    }
}

export class FilesDataSource extends DataSource<any> {
    /**
     * Constructor
     *
     * @param {RequestsService} _requestsService
     */
    constructor(
        private _requestsService: RequestsService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._requestsService.onRequestsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
