import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

import {RequestsService} from 'app/main/requests/requests.service';
import {RequestsRequestFormDialogComponent} from 'app/main/requests/request-form/request-form.component';
import {AuthenticationService} from '../../../@fuse/services/authentication.service';

@Component({
    selector: 'requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RequestsComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedRequests: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;
    private currentHospitalId: string;
    private userId: any;

    /**
     * Constructor
     *
     * @param {RequestsService} _requestsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     * @param auth
     */
    constructor(
        private _requestsService: RequestsService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private auth: AuthenticationService
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
        this._requestsService.onSelectedRequestsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRequests => {
                this.hasSelectedRequests = selectedRequests.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._requestsService.onSearchTextChanged.next(searchText);
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
     * New request
     */
    newRequest(): void {

        this.auth.getUser().subscribe(user => {
            this.currentHospitalId = user.hospital ? user.hospital.id : '';
            this.userId = user._id;
        });
        this.dialogRef = this._matDialog.open(RequestsRequestFormDialogComponent, {
            panelClass: 'request-form-dialog',
            data: {
                action: 'new',
                bloodTypes: this._requestsService.getBloodTypes(),
                currentHospitalId: this.currentHospitalId
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }


                const newRequest = response.getRawValue();
                newRequest.issuer = this.userId;
                this._requestsService.createRequest(newRequest);
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
