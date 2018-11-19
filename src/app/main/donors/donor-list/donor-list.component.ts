import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DonorsService } from 'app/main/donors/donors.service';
import { DonorsDonorFormDialogComponent } from 'app/main/donors/donor-form/donor-form.component';

@Component({
    selector     : 'donors-donor-list',
    templateUrl  : './donor-list.component.html',
    styleUrls    : ['./donor-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class DonorsDonorListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    donors: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'dateOfBirth', 'bloodType', 'status', 'buttons'];
    selectedDonors: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._donorsService);

        this._donorsService.onDonorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(donors => {
                this.donors = donors;

                this.checkboxes = {};
                donors.map(donor => {
                    this.checkboxes[donor.id] = false;
                });
            });

        this._donorsService.onSelectedDonorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDonors => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedDonors.includes(id);
                }
                this.selectedDonors = selectedDonors;
            });

        this._donorsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._donorsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._donorsService.deselectDonors();
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
     * Edit donor
     *
     * @param donor
     */
    editDonor(donor): void
    {
        this.dialogRef = this._matDialog.open(DonorsDonorFormDialogComponent, {
            panelClass: 'donor-form-dialog',
            data      : {
                donor: donor,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._donorsService.updateDonor(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteDonor(donor);

                        break;
                }
            });
    }

    /**
     * Delete Donor
     */
    deleteDonor(donor): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._donorsService.deleteDonor(donor);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param donorId
     */
    onSelectedChange(donorId): void
    {
        this._donorsService.toggleSelectedDonor(donorId);
    }

    /**
     * Toggle star
     *
     * @param donorId
     */
    toggleStar(donorId): void
    {
        if ( this.user.starred.includes(donorId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(donorId), 1);
        }
        else
        {
            this.user.starred.push(donorId);
        }

        this._donorsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {DonorsService} _donorsService
     */
    constructor(
        private _donorsService: DonorsService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._donorsService.onDonorsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
