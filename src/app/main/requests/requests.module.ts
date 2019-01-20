import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule,
    MatToolbarModule, MatSlideToggleModule, MatSelectModule
} from '@angular/material';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';

import {RequestsComponent} from 'app/main/requests/requests.component';
import {RequestsService} from 'app/main/requests/requests.service';
import {RequestsRequestListComponent} from 'app/main/requests/request-list/request-list.component';
import {RequestsSelectedBarComponent} from 'app/main/requests/selected-bar/selected-bar.component';
import {RequestsMainSidebarComponent} from 'app/main/requests/sidebars/main/main.component';
import {RequestsRequestFormDialogComponent} from 'app/main/requests/request-form/request-form.component';
import {NgxSpinnerModule} from 'ngx-spinner';

const routes: Routes = [
    {
        path: 'requests',
        component: RequestsComponent,
        resolve: {
            requests: RequestsService
        }
    }
];

@NgModule({
    declarations: [
        RequestsComponent,
        RequestsRequestListComponent,
        RequestsSelectedBarComponent,
        RequestsMainSidebarComponent,
        RequestsRequestFormDialogComponent
    ],
    imports: [
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
    providers: [
        RequestsService
    ],
    entryComponents: [
        RequestsRequestFormDialogComponent
    ]
})
export class RequestsModule {
}
