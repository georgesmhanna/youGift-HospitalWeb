import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Request} from 'app/main/requests/request.model';

@Component({
    selector: 'requests-request-form-dialog',
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RequestsRequestFormDialogComponent {
    action: string;
    request: Request;
    requestForm: FormGroup;
    dialogTitle: string;
    hospitals: any[];
    bloodTypes: any[];
    currentHospitalId: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<RequestsRequestFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<RequestsRequestFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;
        this.hospitals = _data.hospitals;
        this.bloodTypes = _data.bloodTypes;
        this.currentHospitalId = _data.currentHospitalId;

        console.log('georges bloodtypes are: ', this.bloodTypes);
        if (this.action === 'edit') {
            this.dialogTitle = '';
            this.request = _data.request;

            console.log('georges request is', this.request);
        }
        else {
            this.dialogTitle = 'New Request';
            this.request = new Request({});
        }

        this.requestForm = this.createRequestForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create request form
     *
     * @returns {FormGroup}
     */
    createRequestForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.request.id],
            type: [this.request.type, [Validators.required]],
            quantity: [this.request.quantity, [Validators.required]],
            description: [this.request.description],
            bloodType: [this.request.bloodType, [Validators.required]],
            patientName: [this.request.patientName, [Validators.required]],
            patientContactNumber: [this.request.patientContactNumber, [Validators.required]],
        });
    }
}
