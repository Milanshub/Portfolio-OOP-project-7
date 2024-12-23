type SessionEventType = 'login' | 'logout' | 'token_refresh' | 'session_expired';

interface SessionEvent {
  type: SessionEventType;
  timestamp: number;
  tabId: string;
}

type SessionEventListener = (event: SessionEvent) => void;

export class SessionManager {
  private static instance: SessionManager;
  private readonly tabId: string;
  private readonly listeners: Set<SessionEventListener>;
  private readonly BROADCAST_CHANNEL = 'auth_session_sync';
  private readonly channel: BroadcastChannel;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.tabId = Math.random().toString(36).substring(2, 15);
    this.listeners = new Set();
    this.channel = new BroadcastChannel(this.BROADCAST_CHANNEL);
    this.setupEventListeners();
    this.startHeartbeat();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupEventListeners(): void {
    // Listen for broadcast messages
    this.channel.onmessage = (event) => {
      const sessionEvent = event.data as SessionEvent;
      if (sessionEvent.tabId !== this.tabId) {
        this.notifyListeners(sessionEvent);
      }
    };

    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.emit('token_refresh');
      }
    });

    // Listen for online/offline events
    window.addEventListener('online', () => this.emit('token_refresh'));
    window.addEventListener('offline', () => this.checkConnectivity());
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      // Emit heartbeat event to other tabs
      this.channel.postMessage({
        type: 'heartbeat',
        timestamp: Date.now(),
        tabId: this.tabId,
      });
    }, 30000); // Every 30 seconds
  }

  private checkConnectivity(): void {
    if (!navigator.onLine) {
      this.notifyListeners({
        type: 'session_expired',
        timestamp: Date.now(),
        tabId: this.tabId,
      });
    }
  }

  private notifyListeners(event: SessionEvent): void {
    this.listeners.forEach(listener => listener(event));
  }

  addEventListener(listener: SessionEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(type: SessionEventType): void {
    const event: SessionEvent = {
      type,
      timestamp: Date.now(),
      tabId: this.tabId,
    };

    // Notify local listeners
    this.notifyListeners(event);

    // Broadcast to other tabs
    this.channel.postMessage(event);
  }

  destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.channel.close();
    this.listeners.clear();
  }
} 