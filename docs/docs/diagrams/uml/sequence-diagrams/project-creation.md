# Project Creation Flow
```mermaid
sequenceDiagram
    participant A as Admin
    participant C as React Client
    participant API as Backend API
    participant D as Database

    A->>C: Navigate to Create Project
    A->>C: Fill Project Details
    A->>C: Upload Images
    C->>C: Process Images
    C->>API: POST /api/projects
    API->>D: Save Project
    D-->>API: Confirm Save
    API-->>C: Return Project Data
    C-->>A: Show Success