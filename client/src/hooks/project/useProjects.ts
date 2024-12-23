import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { toast } from 'sonner';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export function useProjects(filters?: string) {
  const queryClient = useQueryClient();

  // Fetch all projects
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: projectKeys.list(filters || 'all'),
    queryFn: () => projectService.getAllProjects(),
  });

  // Fetch featured projects
  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: projectKeys.list('featured'),
    queryFn: () => projectService.getFeaturedProjects(),
  });

  // Get project by ID
  const getProjectById = (id: string) => {
    return useQuery<Project>({
      queryKey: projectKeys.detail(id),
      queryFn: () => projectService.getProjectById(id),
      enabled: !!id,
    });
  };

  // Create project mutation
  const createProjectMutation = useMutation<Project, Error, FormData>({
    mutationFn: (projectData: FormData) => projectService.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project created successfully');
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation<Project, Error, { id: string; data: FormData }>({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(updatedProject.id),
      });
      toast.success('Project updated successfully');
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation<void, Error, string>({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project deleted successfully');
    },
  });

  // Update project thumbnail mutation
  const updateThumbnailMutation = useMutation<Project, Error, { id: string; file: File }>({
    mutationFn: ({ id, file }) => projectService.updateThumbnail(id, file),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(updatedProject.id),
      });
      toast.success('Thumbnail updated successfully');
    },
  });

  // Update project images mutation
  const updateImagesMutation = useMutation<Project, Error, { id: string; files: File[] }>({
    mutationFn: ({ id, files }) => projectService.updateImages(id, files),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(updatedProject.id),
      });
      toast.success('Images updated successfully');
    },
  });

  // Sync with GitHub mutation
  const syncWithGitHubMutation = useMutation<Project, Error, { id: string; repoUrl: string }>({
    mutationFn: ({ id, repoUrl }) => projectService.syncWithGitHub(id, repoUrl),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(updatedProject.id),
      });
      toast.success('Project synced with GitHub successfully');
    },
  });

  return {
    // Queries
    projects,
    featuredProjects,
    isLoading,
    error,
    getProjectById,

    // Mutations
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    updateProjectThumbnail: updateThumbnailMutation.mutate,
    updateProjectImages: updateImagesMutation.mutate,
    syncWithGitHub: syncWithGitHubMutation.mutate,

    // Mutation states
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    isUpdatingThumbnail: updateThumbnailMutation.isPending,
    isUpdatingImages: updateImagesMutation.isPending,
    isSyncing: syncWithGitHubMutation.isPending,
  };
} 