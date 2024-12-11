import jwt from 'jsonwebtoken';
import { IAdmin, ICreateAdmin, IUpdateAdmin } from '../types/entities';
import { Admin } from '../models/Admin';
import { Logger } from '../utils/logger';
import { emailValidator } from '../utils/validators/emailValidator';

export class AdminService {
    private adminModel: Admin;
    private logger = Logger.getInstance();

    constructor() {
        this.adminModel = new Admin();
    }

    async login(email: string, password: string): Promise<{ admin: IAdmin; token: string }> {
        try {
            const admin = await this.adminModel.findByEmail(email);
            if (!admin) {
                this.logger.warn(`Failed login attempt for email: ${email}`);
                throw new Error('Invalid credentials');
            }

            const isValidPassword = await this.adminModel.validatePassword(
                password,
                admin.password
            );

            if (!isValidPassword) {
                this.logger.warn(`Invalid password attempt for admin: ${email}`);
                throw new Error('Invalid credentials');
            }

            // Update last login
            await this.adminModel.updateLastLogin(admin.id);
            this.logger.info(`Admin logged in successfully: ${email}`);

            // Generate JWT token
            const token = jwt.sign(
                { id: admin.id, email: admin.email },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );

            return { admin, token };
        } catch (error: any) {
            this.logger.error(`Login failed: ${error.message}`);
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async createAdmin(adminData: ICreateAdmin): Promise<IAdmin> {
        try {
            // Validate email format
            if (!emailValidator.isValidEmail(adminData.email)) {
                throw new Error('Invalid email format');
            }

            // Check if email already exists
            const existingAdmin = await this.adminModel.findByEmail(adminData.email);
            if (existingAdmin) {
                this.logger.warn(`Attempt to create admin with existing email: ${adminData.email}`);
                throw new Error('Email already registered');
            }

            const admin = await this.adminModel.create(adminData);
            this.logger.info(`New admin created: ${admin.email}`);
            return admin;
        } catch (error: any) {
            this.logger.error(`Failed to create admin: ${error.message}`);
            throw new Error(`Failed to create admin: ${error.message}`);
        }
    }

    async getAdminById(id: string): Promise<IAdmin | null> {
        try {
            const admin = await this.adminModel.findById(id);
            if (!admin) {
                this.logger.warn(`Admin not found with ID: ${id}`);
                throw new Error('Admin not found');
            }
            return admin;
        } catch (error: any) {
            this.logger.error(`Failed to get admin: ${error.message}`);
            throw new Error(`Failed to get admin: ${error.message}`);
        }
    }

    async updateAdmin(id: string, adminData: IUpdateAdmin): Promise<IAdmin> {
        try {
            if (adminData.email && !emailValidator.isValidEmail(adminData.email)) {
                throw new Error('Invalid email format');
            }

            const updatedAdmin = await this.adminModel.update(id, adminData);
            if (!updatedAdmin) {
                this.logger.warn(`Admin not found for update with ID: ${id}`);
                throw new Error('Admin not found');
            }

            this.logger.info(`Admin updated successfully: ${id}`);
            return updatedAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to update admin: ${error.message}`);
            throw new Error(`Failed to update admin: ${error.message}`);
        }
    }

    async deleteAdmin(id: string): Promise<boolean> {
        try {
            const admin = await this.adminModel.findById(id);
            if (!admin) {
                this.logger.warn(`Admin not found for deletion with ID: ${id}`);
                throw new Error('Admin not found');
            }

            const result = await this.adminModel.delete(id);
            if (result) {
                this.logger.info(`Admin deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete admin: ${error.message}`);
            throw new Error(`Failed to delete admin: ${error.message}`);
        }
    }
}