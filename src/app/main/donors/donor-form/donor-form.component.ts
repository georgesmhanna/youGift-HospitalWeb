import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Donor } from 'app/main/donors/donor.model';

@Component({
    selector     : 'donors-donor-form-dialog',
    templateUrl  : './donor-form.component.html',
    styleUrls    : ['./donor-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DonorsDonorFormDialogComponent
{
    action: string;
    donor: Donor;
    donorForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<DonorsDonorFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<DonorsDonorFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Donor';
            this.donor = _data.donor;
        }
        else
        {
            this.dialogTitle = 'New Donor';
            this.donor = new Donor({});
        }

        this.donorForm = this.createDonorForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create donor form
     *
     * @returns {FormGroup}
     */
    createDonorForm(): FormGroup
    {
        return this._formBuilder.group({
            // id      : [this.donor.id],
            firstName    : [this.donor.firstName],
            lastName: [this.donor.lastName],
            avatar  : [this.donor.avatar],
            status : [this.donor.status],
            isDead: [this.donor.isDead],
            isOrganDonor: [this.donor.isOrganDonor],
            middleName: [this.donor.middleName],
            bloodType: [this.donor.bloodType],
            email   : [this.donor.email],
            mobileNumber   : [this.donor.mobileNumber],
            address : [this.donor.address],
            dateOfBirth: [this.donor.dateOfBirth]
        });
    }
}
