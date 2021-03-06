import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import {NgxSpinnerModule} from 'ngx-spinner';

import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import {LoginModule} from './main/login/login.module';
import {ForgotPasswordModule} from './main/forgot-password/forgot-password.module';
import {DonorsModule} from './main/donors/donors.module';
import {RequestsModule} from './main/requests/requests.module';
import {JwtInterceptor} from './utils/jwt.interceptor';
import {AppInterceptor} from './utils/app-interceptor';
import {ErrorInterceptor} from './utils/error.interceptor';


const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'sample'
    },
    {
        path      : 'login',
        redirectTo: 'login'
    },
    {
        path      : 'forgot-password',
        redirectTo: 'forgot-password'
    },
    {
        path        : 'donors',
        redirectTo: 'donors'
    },
    {
        path: 'requests',
        redirectTo: 'requests'
    },

];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        NgxSpinnerModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        LoginModule,
        ForgotPasswordModule,
        DonorsModule,
        RequestsModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
