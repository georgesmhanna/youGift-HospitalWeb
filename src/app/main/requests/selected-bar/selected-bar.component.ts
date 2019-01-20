import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';

import {RequestsService} from 'app/main/requests/requests.service';

@Component({
    selector: 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls: ['./selected-bar.component.scss']
})
export class RequestsSelectedBarComponent implements OnInit, OnDestroy {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedRequests: boolean;
    isIndeterminate: boolean;
    selectedRequests: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

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
        this._requestsService.onSelectedRequestsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRequests => {
                this.selectedRequests = selectedRequests;
                setTimeout(() => {
                    this.hasSelectedRequests = selectedRequests.length > 0;
                    this.isIndeterminate = (selectedRequests.length !== this._requestsService.requests.length && selectedRequests.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void {
        this._requestsService.selectRequests();
    }

    /**
     * Deselect all
     */
    deselectAll(): void {
        this._requestsService.deselectRequests();
    }

    /**
     * Delete selected requests
     */
    deleteSelectedRequests(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected requests?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._requestsService.deleteSelectedRequests();
                }
                this.confirmDialogRef = null;
            });
    }
}
