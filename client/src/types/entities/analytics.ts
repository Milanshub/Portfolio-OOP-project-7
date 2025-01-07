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

export interface CreateAnalyticsEvent extends Omit<AnalyticsEvent, 'id' | 'created_at'> {}
export interface UpdateAnalyticsEvent extends Partial<CreateAnalyticsEvent> {}

export interface CreateAnalytics extends Omit<Analytics, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateAnalytics extends Partial<CreateAnalytics> {}