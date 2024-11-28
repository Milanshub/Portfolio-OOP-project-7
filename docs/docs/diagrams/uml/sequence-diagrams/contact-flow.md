# Contact Form Flow
```mermaid
sequenceDiagram
    participant V as Visitor
    participant C as React Client
    participant API as Backend API
    participant D as Database

    V->>C: Fill Contact Form
    C->>C: Validate Form
    C->>API: POST /api/messages
    API->>D: Save Message
    D-->>API: Confirm Save
    API-->>C: Success Response
    C-->>V: Show Success Message