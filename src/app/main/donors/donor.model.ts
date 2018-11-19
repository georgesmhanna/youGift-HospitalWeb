import { FuseUtils } from '@fuse/utils';

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

    /**
     * Constructor
     *
     * @param donor
     */
    constructor(donor)
    {
        {
            this.firstName = donor.firstName || '';
            this.lastName = donor.lastName || '';
            this.status = donor.status || true;
            this.avatar = donor.avatar || 'assets/images/avatars/profile.jpg';
            this.middleName = donor.middleName || '';
            this.bloodType = donor.bloodType || '';
            this.isDead = donor.isDead || false;
            this.isOrganDonor = donor.isOrganDonor || false;
            this.email = donor.user.email || '';
            this.mobileNumber = donor.mobileNumber || '';
            this.address = donor.address || '';
            this.dateOfBirth = donor.dateOfBirth || '';


        }
    }
}
