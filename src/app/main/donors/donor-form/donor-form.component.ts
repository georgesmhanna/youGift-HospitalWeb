import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {emailValidator, matchingPasswords} from '../../../utils/app.validator';

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
    hospitals: any[];
    bloodTypes: any[];
    currentHospitalId: any;

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
        this.hospitals = _data.hospitals;
        this.bloodTypes = _data.bloodTypes;
        this.currentHospitalId = _data.currentHospitalId;

        console.log('georges bloodtypes are: ', this.bloodTypes);
        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Donor';
            this.donor = _data.donor;

            console.log('georges donor is', this.donor);
        }
        else
        {
            this.dialogTitle = 'New Donor';
            this.donor = new Donor({});
        }

        this.donorForm = this.createDonorForm(this.action);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create donor form
     *
     * @returns {FormGroup}
     */
    createDonorForm(action): FormGroup
    {
        return this._formBuilder.group({
            id: [this.donor.id],
            firstName: [this.donor.firstName, [Validators.required]],
            lastName: [this.donor.lastName, [Validators.required]],
            avatar  : [this.donor.avatar],
            status : [this.donor.status],
            isDead: [this.donor.isDead],
            isOrganDonor: [this.donor.isOrganDonor],
            middleName: [this.donor.middleName, [Validators.required]],
            bloodType: [this.donor.bloodType, [Validators.required]],
            email: [this.donor.email, [Validators.required, Validators.email]],
            mobileNumber: [this.donor.mobileNumber, [Validators.required]],
            address: [this.donor.address, [Validators.required]],
            dateOfBirth: [this.donor.dateOfBirth, [Validators.required]],
            password: [this.donor.password, action !== 'edit' ? [Validators.required, Validators.minLength(8)] : []],
            'confirmPassword': ['', action !== 'edit' ? Validators.required : []]
            // });
        }, {validator: action !== 'edit' ? matchingPasswords('password', 'confirmPassword') : null});
    }
}
