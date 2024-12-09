import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { ICreateAdmin, IUpdateAdmin } from '../types/entities';

export class AdminController {
    private adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.adminService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const adminData: ICreateAdmin = req.body;
            const admin = await this.adminService.createAdmin(adminData);
            res.status(201).json(admin);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const adminData: IUpdateAdmin = req.body;
            const admin = await this.adminService.updateAdmin(id, adminData);
            res.status(200).json(admin);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.adminService.deleteAdmin(id);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}