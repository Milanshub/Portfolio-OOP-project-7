import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            uploadedFile?: { url: string };
            uploadedFiles?: { url: string }[];
        }
    }
}

export {};