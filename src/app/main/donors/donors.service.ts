import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Donor } from 'app/main/donors/donor.model';
import {environment} from '../../../environments/environment';

@Injectable()
export class DonorsService implements Resolve<any>
{
    onDonorsChanged: BehaviorSubject<any>;
    onHospitalsChanged: BehaviorSubject<any>;
    onSelectedDonorsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    donors: Donor[];
    hospitals: any[];
    bloodTypes: any[] = ['O+', 'O-', 'AB+', 'AB-', 'A+', 'A-', 'B+', 'B-'];
    user: any;
    selectedDonors: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onDonorsChanged = new BehaviorSubject([]);
        this.onHospitalsChanged = new BehaviorSubject([]);
        this.onSelectedDonorsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getDonors(),
                this.getUserData(),
                this.getHospitals()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getDonors();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getDonors();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get donors
     *
     * @returns {Promise<any>}
     */
    getDonors(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.apiUrl + '/donor')
                    .subscribe((response: any) => {

                        this.donors = response;
                        console.log(`donors: `, this.donors);
                        if ( this.filterBy === 'starred' )
                        {
                            this.donors = this.donors.filter(_donor => {
                                return this.user.starred.includes(_donor.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.donors = this.donors.filter(_donor => {
                                return this.user.frequentDonors.includes(_donor.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.donors = FuseUtils.filterArrayByString(this.donors, this.searchText);
                        }

                        this.donors = this.donors.map(donor => {
                            return new Donor(donor);
                        });

                        this.onDonorsChanged.next(this.donors);
                        resolve(this.donors);
                    }, reject);
            }
        );
    }

    getHospitals(): Promise<any> {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.apiUrl + '/hospital')
                    .subscribe((response: any) => {

                        this.hospitals = response;
                        console.log(`hospitals: `, this.hospitals);

                        this.onHospitalsChanged.next(this.hospitals);
                        resolve(this.hospitals);
                    }, reject);
            }
        );
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiUrl + '/donor/5be9df3fcba4d8451849a443')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected donor by id
     *
     * @param id
     */
    toggleSelectedDonor(id): void
    {
        // First, check if we already have that donor as selected...
        if ( this.selectedDonors.length > 0 )
        {
            const index = this.selectedDonors.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedDonors.splice(index, 1);

                // Trigger the next event
                this.onSelectedDonorsChanged.next(this.selectedDonors);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedDonors.push(id);

        // Trigger the next event
        this.onSelectedDonorsChanged.next(this.selectedDonors);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedDonors.length > 0 )
        {
            this.deselectDonors();
        }
        else
        {
            this.selectDonors();
        }
    }

    /**
     * Select donors
     *
     * @param filterParameter
     * @param filterValue
     */
    selectDonors(filterParameter?, filterValue?): void
    {
        this.selectedDonors = [];

        // If there is no filter, select all donors
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedDonors = [];
            this.donors.map(donor => {
                this.selectedDonors.push(donor.id);
            });
        }

        // Trigger the next event
        this.onSelectedDonorsChanged.next(this.selectedDonors);
    }

    /**
     * Update donor
     *
     * @param donor
     * @returns {Promise<any>}
     */
    updateDonor(donor): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.put(environment.apiUrl + '/donor/' + donor.id, {...donor})
                .subscribe(response => {
                    this.getDonors();
                    resolve(response);
                });
        });
    }

    createDonor(donor): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post(environment.apiUrl + '/donor', {...donor})
                .subscribe(response => {
                    this.getDonors();
                    resolve(response);
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/donor/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getDonors();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect donors
     */
    deselectDonors(): void
    {
        this.selectedDonors = [];

        // Trigger the next event
        this.onSelectedDonorsChanged.next(this.selectedDonors);
    }

    /**
     * Delete donor
     *
     * @param donor
     */
    deleteDonor(donor): Promise<any>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.delete(environment.apiUrl + '/donor/' + donor.id)
                .subscribe(response => {
                    this.getDonors();
                    resolve(response);
                });
        });
        // const donorIndex = this.donors.indexOf(donor);
        // this.donors.splice(donorIndex, 1);
        // this.onDonorsChanged.next(this.donors);
    }

    /**
     * Delete selected donors
     */
    deleteSelectedDonors(): void
    {
        for ( const donorId of this.selectedDonors )
        {
            const donor = this.donors.find(_donor => {
                return _donor.id === donorId;
            });
            const donorIndex = this.donors.indexOf(donor);
            this.donors.splice(donorIndex, 1);
        }
        this.onDonorsChanged.next(this.donors);
        this.deselectDonors();
    }

    getBloodTypes(): any[] {
        return this.bloodTypes;
    }

}
