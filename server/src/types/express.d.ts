import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
            uploadedFile?: { url: string };
            uploadedFiles?: { url: string }[];
        }
    }
}

export {};