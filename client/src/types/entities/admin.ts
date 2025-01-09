export interface Admin {
    id: string;
    name?: string;
    email: string;
    isAdmin: boolean;
    password: string;
    lastLogin: Date;
}

export interface CreateAdmin extends Omit<Admin, 'id' | 'lastLogin'> {}
export interface UpdateAdmin extends Partial<CreateAdmin> {}