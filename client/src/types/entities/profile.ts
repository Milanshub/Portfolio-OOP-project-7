export interface Profile {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    avatar: string;
    resume: string;
    location: string;
    email: string;
}

export interface CreateProfile extends Omit<Profile, 'id'> {}
export interface UpdateProfile extends Partial<CreateProfile> {}