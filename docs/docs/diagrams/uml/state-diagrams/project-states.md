# Project States
```mermaid
stateDiagram-v2
    [*] --> Draft: Create Project
    Draft --> Published: Publish
    Published --> Draft: Unpublish
    Published --> Featured: Set Featured
    Featured --> Published: Unset Featured
    Draft --> [*]: Delete
    Published --> [*]: Delete
    Featured --> [*]: Delete