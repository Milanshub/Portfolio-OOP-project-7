# Data Model

## Admin
- id: UUID PRIMARY KEY
- email: string UNIQUE
- password: string (hashed)
- lastLogin: timestamp

## Profile
- id: UUID PRIMARY KEY
- fullName: string
- title: string
- bio: text
- avatar: string (URL)
- resume: string (URL)
- location: string
- email: string

## Project
- id: UUID PRIMARY KEY
- title: string
- description: text
- shortDescription: text
- thumbnail: string (URL)
- images: string[] (URLs)
- liveUrl: string
- githubUrl: string
- featured: boolean
- order: integer
- startDate: timestamp
- endDate: timestamp

## Technology
- id: UUID PRIMARY KEY
- name: string
- icon: string
- category: enum (FRONTEND, BACKEND, etc.)
- proficiencyLevel: integer

## ContactMessage
- id: UUID PRIMARY KEY
- senderName: string
- senderEmail: string
- subject: string
- message: text
- createdAt: timestamp
- read: boolean