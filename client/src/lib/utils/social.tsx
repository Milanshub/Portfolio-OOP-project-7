import React from 'react';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/utils/analytics';

interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  lastUpdate: string;
}

interface SocialShare {
  platform: 'twitter' | 'linkedin' | 'facebook';
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export async function getGitHubStats(username: string): Promise<GitHubStats> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    return {
      stars: data.public_gists,
      forks: data.public_repos,
      watchers: data.followers,
      lastUpdate: data.updated_at,
    };
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return {
      stars: 0,
      forks: 0,
      watchers: 0,
      lastUpdate: new Date().toISOString(),
    };
  }
}

export async function getGitHubProjects(username: string): Promise<any[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
    const repos = await response.json();
    
    return repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      lastUpdate: repo.updated_at,
    }));
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    return [];
  }
}

export function generateShareLinks({ platform, url, title, description, hashtags }: SocialShare): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';
  const encodedHashtags = hashtags ? hashtags.join(',') : '';

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    default:
      return url;
  }
}

interface ShareButtonProps extends SocialShare {
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ 
  platform, 
  url, 
  title, 
  description, 
  hashtags,
  className 
}) => {
  const shareUrl = generateShareLinks({ platform, url, title, description, hashtags });
  
  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(shareUrl, '_blank', 'width=600,height=400');
    analytics.trackExternalLink(url, platform === 'linkedin' ? 'linkedin' : 'other');
  };

  return (
    <Button 
      onClick={handleShare} 
      variant="outline" 
      className={`share-button ${className || ''}`}
    >
      Share on {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </Button>
  );
}; 