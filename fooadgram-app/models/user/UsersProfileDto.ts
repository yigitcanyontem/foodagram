export interface UsersProfileDto {
    id: string;
    usersId: number;
    firstName: string;
    lastName: string;
    profilePictureID: string;
    bio: string;
    city: string;
    country: string;
    website: string;
    jobTitle: string;
    birthDate: Date;
    createdAt: Date;
    instagramProfile: string;
    facebookProfile: string;
    followingCount: number;
    followersCount: number;
    profilePicture: Blob;
}
