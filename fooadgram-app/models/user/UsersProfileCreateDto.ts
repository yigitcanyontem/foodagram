export interface UsersProfileCreateDto {
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    bannerPictureUrl: string;
    bio: string;
    city: string;
    country: string;
    website: string;
    jobTitle: string;
    birthDate: Date;
    createdDate: Date;
    instagramProfile: string;
    facebookProfile: string;
}
