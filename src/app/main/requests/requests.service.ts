import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {FuseUtils} from '@fuse/utils';

import {Request} from 'app/main/requests/request.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class RequestsService implements Resolve<any> {
    onRequestsChanged: BehaviorSubject<any>;
    // onHospitalsChanged: BehaviorSubject<any>;
    onSelectedRequestsChanged: BehaviorSubject<any>;
    onRequestDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    requests: Request[];
    hospitals: any[];
    bloodTypes: any[] = ['O+', 'O-', 'AB+', 'AB-', 'A+', 'A-', 'B+', 'B-'];
    user: any;
    selectedRequests: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onRequestsChanged = new BehaviorSubject([]);
        // this.onHospitalsChanged = new BehaviorSubject([]);
        this.onSelectedRequestsChanged = new BehaviorSubject([]);
        this.onRequestDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getRequests(),
                this.getRequestData()
                // this.getHospitals()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getRequests();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getRequests();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get srequests
     *
     * @returns {Promise<any>}
     */
    getRequests(): Promise<any> {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.apiUrl + '/requests')
                    .subscribe((response: any) => {

                        this.requests = response;
                        console.log(`requests: `, this.requests);
                        if (this.filterBy === 'starred') {
                            this.requests = this.requests.filter(_request => {
                                return this.user.starred.includes(_request.id);
                            });
                        }

                        if (this.filterBy === 'frequent') {
                            this.requests = this.requests.filter(_request => {
                                return this.user.frequentRequests.includes(_request.id);
                            });
                        }

                        if (this.searchText && this.searchText !== '') {
                            this.requests = FuseUtils.filterArrayByString(this.requests, this.searchText);
                        }

                        this.requests = this.requests.map(request => {
                            return new Request(request);
                        });

                        this.onRequestsChanged.next(this.requests);
                        resolve(this.requests);
                    }, reject);
            }
        );
    }

    // getHospitals(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //             this._httpClient.get(environment.apiUrl + '/hospital')
    //                 .subscribe((response: any) => {
    //
    //                     this.hospitals = response;
    //                     console.log(`hospitals: `, this.hospitals);
    //
    //                     this.onHospitalsChanged.next(this.hospitals);
    //                     resolve(this.hospitals);
    //                 }, reject);
    //         }
    //     );
    // }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getRequestData(): Promise<any> {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.apiUrl + '/requests/5c3e5707b52f040bfa53c3c6')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onRequestDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected requests by id
     *
     * @param id
     */
    toggleSelectedRequest(id): void {
        // First, check if we already have that request as selected...
        if (this.selectedRequests.length > 0) {
            const index = this.selectedRequests.indexOf(id);

            if (index !== -1) {
                this.selectedRequests.splice(index, 1);

                // Trigger the next event
                this.onSelectedRequestsChanged.next(this.selectedRequests);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedRequests.push(id);

        // Trigger the next event
        this.onSelectedRequestsChanged.next(this.selectedRequests);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedRequests.length > 0) {
            this.deselectRequests();
        }
        else {
            this.selectRequests();
        }
    }

    /**
     * Select requests
     *
     * @param filterParameter
     * @param filterValue
     */
    selectRequests(filterParameter?, filterValue?): void {
        this.selectedRequests = [];

        // If there is no filter, select all requests
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedRequests = [];
            this.requests.map(request => {
                this.selectedRequests.push(request.id);
            });
        }

        // Trigger the next event
        this.onSelectedRequestsChanged.next(this.selectedRequests);
    }

    /**
     * Update requests
     *
     * @param request
     * @returns {Promise<any>}
     */
    updateRequest(request): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.put(environment.apiUrl + '/requests/' + request.id, {...request})
                .subscribe(response => {
                    this.getRequests();
                    resolve(response);
                });
        });
    }

    createRequest(request): Promise<any> {
        return new Promise((resolve, reject) => {

            request.date = new Date();
            request.status = true;
            this._httpClient.post(environment.apiUrl + '/requests', {...request})
                .subscribe(response => {
                    this.sendNotification(request);
                    this.getRequests();
                    resolve(response);
                });
        });
    }

    private sendNotification(request): any {
        return new Promise((resolve, reject) => {
            const oneSignalUrl = 'https://onesignal.com/api/v1/notifications';

            // included segments:
            // same blood type as request
            // is enrolled in at least 1 hospital the same as request hospital
            // at least 3 months of last donation
            // status is active and is dead is false

            const payload =
                {
                    'app_id': 'APP_ID',
                    'contents': {'en': request.description},
                    'included_segments': ['All'],
                    'buttons': [
                        {'id': 'id1', 'text': 'Confirm'},
                        {'id': 'id2', 'text': 'Decline'}
                    ]
                };


            let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('Authorization', 'Basic ONE SIGNAL REST API KEY');
            const requestOptions = {
                headers: headers,
            };
            this._httpClient.post(oneSignalUrl, {...payload}, requestOptions)
                .subscribe(response => {
                    this.getRequests();
                    resolve(response);
                });
        });

    }

    /**
     * Update user data
     *
     * @returns {Promise<any>}
     * @param requestData
     */
    updateRequestData(requestData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/requests/' + this.user.id, {...requestData})
                .subscribe(response => {
                    this.getRequestData();
                    this.getRequests();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect requests
     */
    deselectRequests(): void {
        this.selectedRequests = [];

        // Trigger the next event
        this.onSelectedRequestsChanged.next(this.selectedRequests);
    }

    /**
     * Delete request
     *
     * @param request
     */
    deleteRequest(request): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.delete(environment.apiUrl + '/requests/' + request.id)
                .subscribe(response => {
                    this.getRequests();
                    resolve(response);
                });
        });

    }

    /**
     * Delete selected srequests
     */
    deleteSelectedRequests(): void {
        for (const requestId of this.selectedRequests) {
            const request = this.requests.find(_request => {
                return _request.id === requestId;
            });
            const requestIndex = this.requests.indexOf(request);
            this.requests.splice(requestIndex, 1);
        }
        this.onRequestsChanged.next(this.requests);
        this.deselectRequests();
    }

    getBloodTypes(): any[] {
        return this.bloodTypes;
    }

}
