// server/src/utils/emailSender.ts

import { Resend } from 'resend';
import { Logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);
const logger = Logger.getInstance();

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export async function sendEmail({ to, subject, text }: EmailOptions): Promise<void> {
    try {
        await resend.emails.send({
            from: 'Your Portfolio <onboarding@resend.dev>', // or your verified domain
            to,
            subject,
            text
        });
        logger.info('Email notification sent successfully');
    } catch (error: any) {
        logger.error('Failed to send email notification:', error);
        throw new Error('Failed to send email notification');
    }
}