import { authService } from './auth.service';
import { profileService } from './profile.service';
import { projectService } from './project.service';
import { technologyService } from './technology.service';
import { storageService } from './storage.service';
import { githubService } from './github.service';
import { analyticsService } from './analytics.service';

// Export all service instances
export {
  authService,
  profileService,
  projectService,
  technologyService,
  storageService,
  githubService,
  analyticsService,
};

// Export service class types directly from their files
export type { AuthService } from './auth.service';
export type { ProfileService } from './profile.service';
export type { ProjectService } from './project.service';
export type { TechnologyService } from './technology.service';
export type { StorageService } from './storage.service';
export type { GitHubService } from './github.service';
export type { AnalyticsService } from './analytics.service';

// Default export for convenience
export default {
  auth: authService,
  profile: profileService,
  project: projectService,
  technology: technologyService,
  storage: storageService,
  github: githubService,
  analytics: analyticsService,
};