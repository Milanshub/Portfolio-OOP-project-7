export interface Message {
    id: string;
    sender_name: string;
    sender_email: string;
    subject: string;
    message: string;
    created_at: Date;
    read: boolean;
}

export interface CreateMessage extends Omit<Message, 'id' | 'created_at' | 'read'> {}
export interface UpdateMessage extends Partial<CreateMessage> {}