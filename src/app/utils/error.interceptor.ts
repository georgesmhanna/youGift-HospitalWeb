import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../../@fuse/services/authentication.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private spinner: NgxSpinnerService, private router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }

            if (err.status === 403) {
                // auto logout if 403 response returned from api
                this.authenticationService.logout();
                this.router.navigate(['login']);
            }

            const error = err.error.message || err.statusText;
            this.spinner.hide();
            return throwError(error);
        }));
    }
}
