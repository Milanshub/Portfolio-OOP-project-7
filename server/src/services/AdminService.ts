import jwt from 'jsonwebtoken';
import { IAdmin, ICreateAdmin, IUpdateAdmin } from '../types/entities';
import { Admin } from '../models/Admin';

export class AdminService {
    private adminModel: Admin;

    constructor() {
        this.adminModel = new Admin();
    }

    async login(email: string, password: string): Promise<{ admin: IAdmin; token: string }> {
        try {
            const admin = await this.adminModel.findByEmail(email);
            if (!admin) {
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await this.adminModel.validatePassword(
                password,
                admin.password
            );

            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Update last login
            await this.adminModel.updateLastLogin(admin.id);

            // Generate JWT token
            const token = jwt.sign(
                { id: admin.id, email: admin.email },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            return { admin, token };
        } catch (error: any) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async createAdmin(adminData: ICreateAdmin): Promise<IAdmin> {
        try {
            // Validate email format
            if (!this.isValidEmail(adminData.email)) {
                throw new Error('Invalid email format');
            }

            // Check if email already exists
            const existingAdmin = await this.adminModel.findByEmail(adminData.email);
            if (existingAdmin) {
                throw new Error('Email already registered');
            }

            return await this.adminModel.create(adminData);
        } catch (error: any) {
            throw new Error(`Failed to create admin: ${error.message}`);
        }
    }

    async updateAdmin(id: string, adminData: IUpdateAdmin): Promise<IAdmin> {
        try {
            if (adminData.email && !this.isValidEmail(adminData.email)) {
                throw new Error('Invalid email format');
            }

            const updatedAdmin = await this.adminModel.update(id, adminData);
            if (!updatedAdmin) {
                throw new Error('Admin not found');
            }

            return updatedAdmin;
        } catch (error: any) {
            throw new Error(`Failed to update admin: ${error.message}`);
        }
    }

    async deleteAdmin(id: string): Promise<boolean> {
        try {
            const admin = await this.adminModel.findById(id);
            if (!admin) {
                throw new Error('Admin not found');
            }

            return await this.adminModel.delete(id);
        } catch (error: any) {
            throw new Error(`Failed to delete admin: ${error.message}`);
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}