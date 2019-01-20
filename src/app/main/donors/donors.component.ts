import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

import {DonorsService} from 'app/main/donors/donors.service';
import {DonorsDonorFormDialogComponent} from 'app/main/donors/donor-form/donor-form.component';
import {AuthenticationService} from '../../../@fuse/services/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'donors',
    templateUrl: './donors.component.html',
    styleUrls: ['./donors.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DonorsComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedDonors: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;
    private currentHospitalId: string;

    /**
     * Constructor
     *
     * @param {DonorsService} _donorsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _donorsService: DonorsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private auth: AuthenticationService,
        private spinner: NgxSpinnerService
    ) {
        // Set the defaults
        this.searchInput = new FormControl('');

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
        this._donorsService.onSelectedDonorsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedDonors => {
                this.hasSelectedDonors = selectedDonors.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._donorsService.onSearchTextChanged.next(searchText);
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
     * New donor
     */
    newDonor(): void {

        this.auth.getUser().subscribe(user => {
            this.currentHospitalId = user.hospital ? user.hospital.id : '';
        });
        this.dialogRef = this._matDialog.open(DonorsDonorFormDialogComponent, {
            panelClass: 'donor-form-dialog',
            data: {
                action: 'new',
                bloodTypes: this._donorsService.getBloodTypes(),
                currentHospitalId: this.currentHospitalId
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }


                const newDonor = response.getRawValue();
                delete newDonor.avatar;
                newDonor.hospitals = [];
                newDonor.hospitals.push(this.currentHospitalId);
                console.log('new : ', newDonor);
                this.spinner.show();
                this._donorsService.createDonor(newDonor).then(() => {
                    this.spinner.hide();
                });

            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
