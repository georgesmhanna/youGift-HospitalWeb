import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { DonorsComponent } from 'app/main/donors/donors.component';
import { DonorsService } from 'app/main/donors/donors.service';
import { DonorsDonorListComponent } from 'app/main/donors/donor-list/donor-list.component';
import { DonorsSelectedBarComponent } from 'app/main/donors/selected-bar/selected-bar.component';
import { DonorsMainSidebarComponent } from 'app/main/donors/sidebars/main/main.component';
import { DonorsDonorFormDialogComponent } from 'app/main/donors/donor-form/donor-form.component';

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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        DonorsService
    ],
    entryComponents: [
        DonorsDonorFormDialogComponent
    ]
})
export class DonorsModule
{
}
