import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DonorsService } from 'app/main/donors/donors.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class DonorsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedDonors: boolean;
    isIndeterminate: boolean;
    selectedDonors: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DonorsService} _donorsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _donorsService: DonorsService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._donorsService.onSelectedDonorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDonors => {
                this.selectedDonors = selectedDonors;
                setTimeout(() => {
                    this.hasSelectedDonors = selectedDonors.length > 0;
                    this.isIndeterminate = (selectedDonors.length !== this._donorsService.donors.length && selectedDonors.length > 0);
                }, 0);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
    selectAll(): void
    {
        this._donorsService.selectDonors();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._donorsService.deselectDonors();
    }

    /**
     * Delete selected donors
     */
    deleteSelectedDonors(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected donors?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._donorsService.deleteSelectedDonors();
                }
                this.confirmDialogRef = null;
            });
    }
}
