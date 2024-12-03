# Message States
```mermaid
stateDiagram-v2
    [*] --> Unread: New Message
    Unread --> Read: View Message
    Read --> Archived: Archive
    Unread --> Archived: Archive
    Archived --> [*]: Delete