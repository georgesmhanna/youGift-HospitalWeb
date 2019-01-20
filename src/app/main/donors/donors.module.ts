import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule,
    MatToolbarModule, MatSlideToggleModule, MatSelectModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { DonorsComponent } from 'app/main/donors/donors.component';
import { DonorsService } from 'app/main/donors/donors.service';
import { DonorsDonorListComponent } from 'app/main/donors/donor-list/donor-list.component';
import { DonorsSelectedBarComponent } from 'app/main/donors/selected-bar/selected-bar.component';
import { DonorsMainSidebarComponent } from 'app/main/donors/sidebars/main/main.component';
import { DonorsDonorFormDialogComponent } from 'app/main/donors/donor-form/donor-form.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from '../../utils/jwt.interceptor';
import {AppInterceptor} from '../../utils/app-interceptor';
import {ErrorInterceptor} from '../../utils/error.interceptor';
import {NgxSpinnerModule} from 'ngx-spinner';

const routes: Routes = [
    {
        path     : 'donors',
        component: DonorsComponent,
        resolve  : {
            donors: DonorsService
        }
    }
];

@NgModule({
    declarations   : [
        DonorsComponent,
        DonorsDonorListComponent,
        DonorsSelectedBarComponent,
        DonorsMainSidebarComponent,
        DonorsDonorFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatSlideToggleModule,
        MatSelectModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        NgxSpinnerModule
    ],
    providers      : [
        DonorsService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
    entryComponents: [
        DonorsDonorFormDialogComponent
    ]
})
export class DonorsModule
{
}
