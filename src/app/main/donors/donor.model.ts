import { FuseUtils } from '@fuse/utils';
import {environment} from '../../../environments/environment';

export class Donor
{
    id: string;
    firstName: string;
    lastName: string;
    status: boolean;
    middleName: string;
    bloodType: string;
    dateOfBirth: string;
    email: string;
    mobileNumber: string;
    isDead: boolean;
    isOrganDonor: boolean;
    cities: Array<any>;
    address: string;
    avatar: string;
    user: any;
    password: any;

    /**
     * Constructor
     *
     * @param donor
     */
    constructor(donor)
    {
        {
            this.id = donor.id;
            this.firstName = donor.firstName || '';
            this.lastName = donor.lastName || '';
            this.status = donor.status;
            this.avatar = donor.avatar ? environment.apiUrl + donor.avatar.url : 'assets/images/avatars/profile.jpg';
            this.middleName = donor.middleName || '';
            this.bloodType = donor.bloodType || '';
            this.isDead = donor.isDead;
            this.isOrganDonor = donor.isOrganDonor;
            this.email = donor.user ? donor.user.email : '';
            this.mobileNumber = donor.mobileNumber || '';
            this.address = donor.address || '';
            this.dateOfBirth = donor.dateOfBirth || '';
            this.password = donor.user ? donor.user.password : '';


        }
    }
}
