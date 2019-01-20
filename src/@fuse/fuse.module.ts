import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { FUSE_CONFIG } from '@fuse/services/config.service';
import {AuthenticationService} from './services/authentication.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from '../app/utils/jwt.interceptor';
import {AppInterceptor} from '../app/utils/app-interceptor';
import {ErrorInterceptor} from '../app/utils/error.interceptor';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule()
export class FuseModule
{
    constructor(@Optional() @SkipSelf() parentModule: FuseModule)
    {
        if ( parentModule )
        {
            throw new Error('FuseModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders
    {
        return {
            ngModule : FuseModule,
            providers: [
                {
                    provide : FUSE_CONFIG,
                    useValue: config
                },
                AuthenticationService,
                {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
                {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
                {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
            ],
        };
    }
}
