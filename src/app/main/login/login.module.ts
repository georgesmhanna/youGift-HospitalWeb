import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { LoginComponent } from 'app/main/login/login.component';

const routes = [
    {
        path     : 'login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
MatSnackBarModule,
        FuseSharedModule
    ]
})
export class LoginModule
{
}
