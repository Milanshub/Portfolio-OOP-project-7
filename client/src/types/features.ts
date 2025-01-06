export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  created_at: Date;
  read: boolean;
}

export interface ContactForm {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
}

export interface Analytics {
  id: string;
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: number;
  mostViewedProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  event_data: any;
  timestamp: Date;
  created_at: Date;
} 