import { z } from 'zod';
import { TechnologyCategory } from '@/types';

// Base schemas
export const idSchema = z.string().min(1);
export const emailSchema = z.string().email();
export const urlSchema = z.string().url().optional();
export const dateSchema = z.coerce.date();

// Project Schema
export const projectSchema = z.object({
  id: idSchema,
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  shortDescription: z.string().min(10).max(200),
  thumbnail: z.string().min(1),
  images: z.array(z.string()),
  liveUrl: urlSchema,
  githubUrl: urlSchema,
  featured: z.boolean(),
  order: z.number().int().min(0),
  startDate: dateSchema,
  endDate: dateSchema,
  technologies: z.array(z.string()),
  githubData: z.object({
    stars: z.number(),
    forks: z.number(),
    lastCommit: dateSchema,
    languages: z.record(z.number())
  }).optional()
});

// Profile Schema
export const profileSchema = z.object({
  id: idSchema,
  fullName: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  bio: z.string().min(10),
  avatar: z.string(),
  resume: z.string(),
  location: z.string(),
  email: emailSchema
});

// Technology Schema
export const technologySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(50),
  icon: z.string(),
  category: z.nativeEnum(TechnologyCategory),
  proficiencyLevel: z.number().min(1).max(5)
});

// Auth Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8)
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).max(100)
});

// Contact Form Schema
export const contactFormSchema = z.object({
  sender_name: z.string().min(2).max(100),
  sender_email: emailSchema,
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(1000)
});

// File Upload Schemas
export const uploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png, and .webp formats are supported'
    )
});

export const multipleUploadSchema = z.object({
  files: z.array(uploadSchema.shape.file)
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed')
}); 