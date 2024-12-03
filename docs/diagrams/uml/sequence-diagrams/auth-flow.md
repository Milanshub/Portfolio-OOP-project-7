# Authentication Flow
```mermaid
sequenceDiagram
    participant A as Admin
    participant C as React Client
    participant API as Backend API
    participant D as Database

    A->>C: Enter Credentials
    C->>API: POST /auth/login
    API->>D: Query Admin
    D-->>API: Return Admin Data
    API->>API: Validate Password
    API->>API: Generate JWT
    API-->>C: Return JWT + Admin Data
    C->>C: Store JWT
    C-->>A: Redirect to Dashboard