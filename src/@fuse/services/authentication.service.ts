import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import Strapi from 'strapi-sdk-javascript/build/module/lib/sdk';


@Injectable()
export class AuthenticationService {
    isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
    userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    strapi = new Strapi(environment.apiUrl);
    constructor(private http: HttpClient) {}

    public isLoggedIn(): Observable<boolean>{
        return this.isLoginSubject.asObservable();
    }

    public getUser(): Observable<any>{
        return this.userSubject.asObservable();
    }

     login(email: string, password: string): any {
        return this.http.post<any>(`${environment.apiUrl}/auth/local`, {identifier: email, password: password})
            .pipe(map(auth => {
                let user;
                // login successful if there's a jwt token in the response
                if (auth && auth.user && auth.jwt) {
                    user = auth.user;
                    user.token = auth.jwt;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.strapi.setToken(auth.jwt);
                    this.isLoginSubject.next(true);
                    this.userSubject.next(user);
                }
                return user;
            }));
    }

    logout(): void {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.strapi.clearToken();
        this.isLoginSubject.next(false);
        this.userSubject.next(null);
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    private getUserFromStorage(): string{
        return this.hasToken() ? JSON.parse(localStorage.getItem('currentUser')) : null;
    }
}
