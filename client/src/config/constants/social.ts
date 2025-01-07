import { siteConfig } from '../site';

export const SOCIAL_LINKS = {
  GITHUB: siteConfig.links.github,
  LINKEDIN: 'https://www.linkedin.com/in/milan-shubaev-88276465/',
  EMAIL: siteConfig.links.email,
} as const;

export const SOCIAL_USERNAMES = {
  GITHUB: 'Milanshub',
  LINKEDIN: 'milan-shubaev-88276465',
} as const;

export const SOCIAL_ICONS = {
  GITHUB: '/icons/github.svg',
  LINKEDIN: '/icons/linkedin.svg',
  EMAIL: '/icons/email.svg',
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;
export type SocialIcon = keyof typeof SOCIAL_ICONS;

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: string;
  label: string;
  username?: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'GITHUB',
    url: SOCIAL_LINKS.GITHUB,
    icon: SOCIAL_ICONS.GITHUB,
    label: 'GitHub',
    username: SOCIAL_USERNAMES.GITHUB,
  },
  {
    platform: 'LINKEDIN',
    url: SOCIAL_LINKS.LINKEDIN,
    icon: SOCIAL_ICONS.LINKEDIN,
    label: 'LinkedIn',
    username: SOCIAL_USERNAMES.LINKEDIN,
  },
  {
    platform: 'EMAIL',
    url: `mailto:${SOCIAL_LINKS.EMAIL}`,
    icon: SOCIAL_ICONS.EMAIL,
    label: 'Email',
  },
];

// Utility functions
export const getSocialUsername = (platform: SocialPlatform): string => {
    if (platform === 'EMAIL') return '';
    return SOCIAL_USERNAMES[platform as keyof typeof SOCIAL_USERNAMES] || '';
  };

export const getSocialUrl = (platform: SocialPlatform): string => {
  return SOCIAL_LINKS[platform] || '';
};

export const getSocialIcon = (platform: SocialPlatform): string => {
  return SOCIAL_ICONS[platform] || '';
};