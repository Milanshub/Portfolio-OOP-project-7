import React from 'react';

interface PersonSchema {
  name: string;
  jobTitle: string;
  image?: string;
  sameAs?: string[];
  description?: string;
}

interface ProjectSchema {
  name: string;
  description: string;
  image?: string;
  url?: string;
  datePublished?: string;
  technologies?: string[];
}

interface SchemaScriptProps {
  schema: Record<string, any>;
}

export function generatePersonSchema(person: PersonSchema): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    image: person.image,
    sameAs: person.sameAs,
    description: person.description,
  };
}

export function generateProjectSchema(project: ProjectSchema): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    image: project.image,
    url: project.url,
    datePublished: project.datePublished,
    keywords: project.technologies,
  };
}

export function generatePortfolioSchema(
  person: PersonSchema,
  projects: ProjectSchema[]
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      ...generatePersonSchema(person),
      knowsAbout: projects.map(project => ({
        '@type': 'CreativeWork',
        ...generateProjectSchema(project),
      })),
    },
  };
}

export const SchemaScript: React.FC<SchemaScriptProps> = ({ schema }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
); 