import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {first} from 'rxjs/internal/operators';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../@fuse/services/authentication.service';

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param snackBar
     * @param authenticationService
     * @param route
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public router: Router,
        public snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    login(values): void{
        console.log('values: ', values);
        if (this.loginForm.valid) {
            this.authenticationService.login(values.email, values.password)
                .pipe(first())
                .subscribe(data => {
                    console.log('login data: ', data);
                    this.snackBar.open(`User ${data.firstName} ${data.lastName} successfully logged in`, null, {panelClass: 'success', verticalPosition: 'top', duration: 3000});
                    this.router.navigate(['/']);
                }, err => {
                    console.log('err: ', err);
                    this.snackBar.open(err, null, {panelClass: 'error', verticalPosition: 'top', duration: 3000});
                });
        }
    }
}
